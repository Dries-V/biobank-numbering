# biobank-numbering

A command-line script that assigns freezer location codes to biobank samples in an Excel file. It reads a source sheet, filters samples based on viral load results, and writes the assigned codes to an output file.

---

## Setup guide

This is a one-time setup. Once completed, running the script in the future only requires the last step.

### 1. Open a terminal

On macOS, press **Command + Space**, type **Terminal**, and press Enter.

### 2. Clone the repository

This downloads the script to your computer. Choose a folder where you want to store it (your home folder is fine) and run:

```bash
git clone https://github.com/Dries-V/biobank-numbering.git
cd biobank-numbering
```

If you don't have Git installed, macOS will prompt you to install the Xcode Command Line Tools — click **Install** and re-run the command afterwards.

### 3. Install mise

[mise](https://mise.jdx.dev) is a tool that installs and manages the exact versions of Node.js and Yarn that this script requires.

```bash
curl https://mise.run | sh
```

After it finishes, follow the instruction it prints to activate mise in your shell. It will look something like this — the exact line depends on which shell you use:

```bash
# For zsh (the default on modern macOS):
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

Verify the installation worked:

```bash
mise --version
```

### 4. Install Node.js and Yarn

Inside the `biobank-numbering` folder, run:

```bash
mise install
```

This reads the `.mise.toml` file in the repository and automatically installs the correct versions of Node.js and Yarn. You do not need to choose any version numbers yourself.

Verify both are available:

```bash
node --version
yarn --version
```

### 5. Install script dependencies

Still inside the `biobank-numbering` folder, run:

```bash
yarn install
```

This downloads the libraries the script depends on. It only needs to be done once (or again after a `git pull` that updates `package.json`).

---

## Running the script

The script takes an input Excel file and writes a new Excel file with the assigned location codes filled in.

### Basic usage

```bash
yarn start --input "path/to/input.xlsx" --output "path/to/output.xlsx"
```

**Replace the paths** with the actual locations of your files. You can use relative paths (relative to where your terminal is) or full absolute paths. Example:

```bash
yarn start --input "/Users/yourname/Documents/Biobank aanvulling 2024.xlsx" --output "/Users/yourname/Documents/filtered.xlsx"
```

> **Tip:** you can drag a file from Finder into the terminal window and it will paste the full path automatically.

### All parameters

Only `--input` and `--output` are required. All others have sensible defaults and only need to be specified if your Excel file uses different column or sheet names.

| Parameter                     | Short | Required | Default              | Description                                            |
| ----------------------------- | ----- | -------- | -------------------- | ------------------------------------------------------ |
| `--input`                     | `-i`  | Yes      | —                    | Path to the input `.xlsx` file                         |
| `--output`                    | `-o`  | Yes      | —                    | Path to write the output `.xlsx` file                  |
| `--first-code`                | `-c`  | No       | `A1-11-1-01`         | The first freezer location code to assign              |
| `--from-sheet`                | `-f`  | No       | `Tbl_Samples_1`      | Sheet containing the new samples to process            |
| `--to-sheet`                  | `-t`  | No       | `Tbl_Samples_2`      | Sheet containing previously processed samples          |
| `--sample-code-column`        | `-s`  | No       | `Sample-Code`        | Column name for sample codes                           |
| `--patient-id-column`         |       | No       | `PatientID`          | Column name for patient IDs                            |
| `--collection-date-column`    |       | No       | `Collection_date`    | Column name for collection dates                       |
| `--vl-symbol-column`          |       | No       | `VL_Symbol`          | Column name for viral load symbols (e.g. `<`)          |
| `--vl-result-column`          |       | No       | `VL_Result`          | Column name for viral load results                     |
| `--status-buffycoat-column`   |       | No       | `Status_BuffyCoat`   | Column name for BuffyCoat availability status          |
| `--status-plasma-column`      |       | No       | `Status_Plasma`      | Column name for Plasma availability status             |
| `--location-buffycoat-column` |       | No       | `Location_BuffyCoat` | Column name where BuffyCoat location codes are written |
| `--location-plasma-column`    |       | No       | `Location_Plasma`    | Column name where Plasma location codes are written    |

### Example with non-default sheet names

```bash
yarn start \
  --input "/Users/yourname/Documents/Biobank aanvulling 2024.xlsx" \
  --output "/Users/yourname/Documents/filtered.xlsx" \
  --from-sheet "Tbl_Sam_1" \
  --first-code "B2-34-2-15"
```

The `\` at the end of each line is just a way to split a long command across multiple lines — the terminal treats it as one single command.
