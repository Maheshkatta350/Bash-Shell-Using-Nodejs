const fs = require("fs").promises;
const { spawn } = require("node:child_process");

// Change process working directory to home directory
// process.chdir(process.env.HOME);

// Map of spawned processes
const spawnedProcessMap = new Map();
// Reference to active process
let activeProcess = null;

const prompt = () => {
    process.stdout.write(`${process.cwd()} > `);
};

// Handles the input from the user
const commandHandle = async (input) => {
    const [command, ...args] = input.split(" ");

    switch (command) {
        // Change directory
        case "cd": {
            process.chdir(args[0]);
            process.stdout.write("\n");
            prompt();
            break;
        }
        // Display current directory
        case "pwd": {
            process.stdout.write(process.cwd());
            process.stdout.write("\n");
            prompt();
            break;
        }
        // List directory
        case "ls":
            {
                await fs
                    .readdir(process.cwd())
                    .then((files) => {
                        process.stdout.write(files.join(" "));
                    })
                    .catch((err) => {
                        process.stdout.write(err.message);
                    });
                process.stdout.write("\n");
                prompt();
            }
            break;
        // Exit shell
        case "exit":
            {
                process.exit();
            }
        // Background Process to Foreground process with given PID
        case "fg":
            {
                const [jobId] = args;
                const job = spawnedProcessMap.get(parseInt(jobId));
                if (job) {
                    job.kill("SIGCONT");
                    activeProcess = job;
                }
            }
            break;
        default: {
            const spawnedProcess = spawn(command, args, {
                stdio: [process.stdin, process.stdout, process.stderr],
            });
            activeProcess = spawnedProcess;
            spawnedProcessMap.set(spawnedProcess.pid, spawnedProcess);
            spawnedProcess.on("exit", () => {
                spawnedProcessMap.delete(spawnedProcess.pid);
                process.stdout.write("\n");
                prompt();
            });
            spawnedProcess.on("error", (err) => {
                process.stdout.write("Invalid command");
                spawnedProcessMap.delete(spawnedProcess.pid);
                spawnedProcess.kill();
                activeProcess = null;
                process.stdout.write("\n");
                prompt();
            });
        }
    }
};


if (__filename === process.argv[1]) {
    prompt();

    // Handles SIGINT i.e CTRL+C
    process.on("SIGINT", () => {
        if (activeProcess) {
            activeProcess.kill("SIGINT");
            activeProcess = null;
        } else {
            process.stdout.write("\n");
            prompt();
        }
    });

    // Handles SIGSTP i.e CTRL+Z
    process.on("SIGTSTP", () => {
        if (activeProcess) {
            activeProcess.kill("SIGTSTP");
            process.stdout.write("\nProcess Stopped. PID: " + activeProcess.pid);
            activeProcess = null;
        }
        process.stdout.write("\n");
        prompt();

    });

    process.stdin.on("data", async (data) => {
        if (!activeProcess) {
            data = data.toString().trim();
            commandHandle(data);
        }
    });
}
