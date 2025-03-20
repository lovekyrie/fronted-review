# fronted-review

前端知识巩固

# vscode settings.json

```
  "vim.easymotion": true,
  "vim.incsearch": true,
  "vim.useSystemClipboard": true,
  "vim.useCtrlKeys": true,
  "vim.hlsearch": true,
  "vim.sneak": true,
  "vim.visualModeKeyBindings": [
    {
      "before": ["H"],
      "after": ["^"]
    },
    {
      "before": ["L"],
      "after": ["g", "_"]
    },
    {
      "before": ["J"],
      "after": ["5", "j"]
    },
    {
      "before": ["K"],
      "after": ["5", "k"]
    },
    {
      "before": ["f"],
      "after": ["s"]
    }
  ],
  "vim.operatorPendingModeKeyBindings": [
    {
      "before": ["H"],
      "after": ["^"]
    },
    {
      "before": ["L"],
      "after": ["g", "_"]
    }
  ],
  "vim.operatorPendingModeKeyBindingsNonRecursive": [
    {
      "before": ["f"],
      "after": ["z"]
    },
    {
      "before": ["F"],
      "after": ["Z"]
    }
  ],
  "vim.normalModeKeyBindingsNonRecursive": [
    {
      "before": ["<leader>", "d"],
      "after": ["d", "d"]
    },
    {
      "before": ["<C-n>"],
      "commands": [":nohl"]
    },
    {
      "before": ["K"],
      "commands": ["lineBreakInsert"],
      "silent": true
    },
    {
      "before": ["g", "d"],
      "commands": ["editor.action.revealDefinition"]
    },
    {
      "before": ["g", "r"],
      "commands": ["editor.action.goToReferences"]
    },
    {
      "before": ["g", "i"],
      "commands": ["editor.action.goToImplementation"]
    },
    {
      "before": ["J"],
      "after": ["5", "j"]
    },
    {
      "before": ["K"],
      "after": ["5", "k"]
    },
    {
      "before": ["f"],
      "after": ["s"]
    },
    {
      "before": ["F"],
      "after": ["S"]
    },
    {
      "before": ["s"],
      "after": ["c", "l"]
    },
    {
      "before": ["S"],
      "after": ["^", "C"]
    }
  ],
  "vim.normalModeKeyBindings": [
    {
      "before": ["<leader>", "f"],
      "commands": ["editor.action.formatDocument"]
    },
    {
      "before": ["leader", "w"],
      "commands": ["workbench.action.files.save"]
    },
    {
      "before": ["H"],
      "after": ["^"]
    },
    {
      "before": ["L"],
      "after": ["g", "_"]
    }
  ],
  "vim.leader": "<space>",
  "vim.handleKeys": {
    "<C-a>": false,
    "<C-w>": false
  },
```
