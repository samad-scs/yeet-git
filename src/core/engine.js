import \{ logger \} from './logger.js';
import git from '../services/git.js';
import ai from '../services/ai.js';
import \{ strategies \} from '../commands/strategies.js';

class WorkflowEngine \{
  constructor() \{
    this.context = \{
      currentBranch: null,
      targetBranch: null,
      actions: [],
      flags: \{
        yes: false,
        noLabel: false,
      \},
    \};
  \}

  async parse(args) \{
    // args from process.argv.slice(2)
    this.context.currentBranch = await git.getCurrentBranch();
    
    for (let i = 0; i < args.length; i++) \{
      const arg = args[i];

      if (arg.startsWith('--to-')) \{
        this.context.targetBranch = arg.replace('--to-', '');
        logger.info(`Target branch set to: ${this.context.targetBranch}`);
        continue;
      \}

      if (arg.startsWith('--label-')) \{
         this.context.flags.label = arg.replace('--label-', '');
         continue;
      \}
      
      if (arg === '--c') \{
        this.context.actions.push(\{ type: 'COMMIT' \});
      \} else if (arg === '--p') \{
        this.context.actions.push(\{ type: 'PUSH' \});
      \} else if (arg === '--merge') \{
        this.context.actions.push(\{ type: 'MERGE' \});
      \} else if (arg === '--yes' || arg === '-y') \{
        this.context.flags.yes = true;
      \} else if (arg === '--no-label') \{
        this.context.flags.noLabel = true;
      \} else \{
        // Handle unknown or maybe interactive kickoff if empty
        logger.warn(`Unknown argument: ${arg}`);
      \}
    \}
    
    return this;
  \}

  async execute() \{
    logger.box('Sweet Commit Workflow', [
      `Source: ${this.context.currentBranch}`,
      this.context.targetBranch ? `Target: ${this.context.targetBranch}` : null
    ].filter(Boolean));

    for (const action of this.context.actions) \{
      try \{
        await strategies[action.type](this.context);
      \} catch (error) \{
        logger.error(`Action ${action.type} failed: ${error.message}`);
        // Decide whether to halt or continue. Usually halt.
        process.exit(1);
      \}
    \}
    
    logger.success('Workflow completed successfully!');
  \}
\}

export default new WorkflowEngine();
