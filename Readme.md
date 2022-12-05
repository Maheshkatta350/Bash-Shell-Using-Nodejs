# BASH LIKE SHELL USING NODEJS 

## Commands

- **cd <directory_name>** : Sets current working directory to given directory.
- **pwd** : Lists current working directory.
- **ls <directory_name>** : Lists the contents of the given directory.
- **<path_to_binary> <args>** : The binary is spawned as child process with the args passed.
- **fg <pid>** : Brings the background process with process id <pid> to foreground.
- **exit** : Closes the shell.
- **CTRL + C** : Sends a SIGINT to the spawned process.
- **CTRL + Z** : Sends spawned process that is currently in foreground to the background and prints it’s pid after setting the current process as background process.

## Running the shell

Start the shell using `node shell.js`

The shell starts with its default working directory set to user’s home directory.

## Test cases

1. `node app.js` : Runs a NodeJs script named app.js in the current working directory of the app.

## References
1. https://nodejs.org/api/process.html
2. https://nodejs.org/api/child_process.html
3. https://nodejs.org/en/knowledge/command-line/how-to-prompt-for-command-line-input/
4. https://nodejs.org/api/fs.html
