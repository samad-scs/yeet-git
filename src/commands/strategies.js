import git from '../services/git.js';
import ai from '../services/ai.js';
import \{ logger \} from '../core/logger.js';
import \{ intro, text, confirm, spinner \} from '@clack/prompts';

export const strategies = \{
  COMMIT: async (context) => \{
    const s = spinner();
    s.start('Checking git status...');
    
    const hasChanges = await git.hasChanges();
    if (!hasChanges) \{
      s.stop('No changes to commit.');
      return;
    \}
    s.stop('Changes detected.');

    // Stage all
    await git.stageAll();
    logger.step('Staged all files.');

    // Generate message
    s.start('Generating commit message with AI...');
    const diff = await git.getDiff(true);
    const message = await ai.generateCommitMessage(diff);
    s.stop('Message generated.');

    let finalMessage = message;

    if (!context.flags.yes) \{
      const confirmed = await confirm(\{
        message: `Commit with: "${message}"?`,
      \});
      if (!confirmed) \{
        finalMessage = await text(\{
          message: 'Enter commit message:',
          placeholder: 'feat: ...',
          initialValue: message
        \});
        if (!finalMessage) throw new Error('Commit cancelled.');
      \}
    \}

    await git.commit(finalMessage);
    logger.success(`Committed: ${finalMessage}`);
  \},

  PUSH: async (context) => \{
    const s = spinner();
    s.start(`Pushing to ${context.currentBranch}...`);
    await git.push('origin', context.currentBranch);
    s.stop('Push complete.');
    logger.success('Changes pushed to remote.');
  \},

  MERGE: async (context) => \{
    if (!context.targetBranch) \{
      throw new Error('Target branch not specified. Use --to-<branch> before --merge.');
    \}

    // Check if we need to commit first? 
    // Usually merge implies taking current work and merging it INTO target.
    // Or does it mean merging target INTO current?
    // User request: "scom --to-[branch-name] --merge... So it merges to that branch from current branch"
    // This implies: checkout target -> merge source -> push target (maybe)
    
    const source = context.currentBranch;
    const target = context.targetBranch;

    logger.info(`Switching to ${target} to merge ${source}...`);
    
    // 1. Checkout target
    await git.checkout(target);
    
    // 2. Pull latest target to be safe
    await git.run(['pull', 'origin', target]);
    
    // 3. Merge source
    try \{
      await git.merge(source);
      logger.success(`Merged ${source} into ${target}`);
      
      // 4. Push target?
      // Assuming automatic push for "scom" flow or maybe explicit --p needed?
      // "So it merges to dev and creates a PR...".
      // Let's assume just local merge unless --p is present?
      // But the context actions are linear. if --p follows --merge, it will execute PUSH.
      // But PUSH strategy uses context.currentBranch.
      // Since we switched branch, context.currentBranch is now STALE.
      // WE MUST UPDATE CONTEXT!
      
      context.currentBranch = target; 
      
    \} catch (error) \{
      logger.error('Merge conflict or error. Aborting.');
      await git.run(['merge', '--abort']).catch(() => \{\});
      await git.checkout(source); // Switch back
      throw error;
    \}
  \}
\};
