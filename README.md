## Requirements

To run the project, you must install <a href="https://getcomposer.org/">Composer</a> on your computer and meet the following conditions.

- PHP >= 8.1

## Download with zip file

- Download the zip file of the project to your computer with the green code button.
- Extract the file from the zip.

## Download with git


If git is not installed on your computer, install the appropriate one for your operating system from this <a href="https://git-scm.com/downloads">link</a>

- Open the terminal screen and paste the code below and run it.

  ```
  git clone https://github.com/hsdmr/rest-api.git
  ```
## Installation

- Rename the file named .env.example in the project file to .env .
- Save your database information in the appropriate place in the .env file.
- Enter the project file from the terminal and paste the following codes respectively.

  ```
  composer install
  php run migrate
  php run serve
  ```
  
- Enter the project file under resource/admin and run the following codes.

  ```
  npm install
  npm run build
  ```
