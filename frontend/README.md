# Eco Planner

<a id="readme-top"></a>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#prerequisites">Prerequisites</a>
      <ul>
        <li>
        <a href="#ssl-certificates">SSL certificates</a>
        <ul>
          <li><a href="#windows">Windows</a></li>
          <li><a href="#ubuntudebian">Ubuntu/Debian</a></li>
        </ul>
        </li>
        <li><a href="#set-up-env-file">Set up .env file</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting started</a>
        <ul>
          <li><a href="#install-dependencies">Install dependencies</a></li>
          <li><a href="#start-the-app">Start the app</a>
        </ul>
    </li>
  </ol>
</details>

<!-- Prerequisites -->

## Prerequisites

<!--SSL Certificates-->

### SSL certificates

Install certificates for the app to work properly, you can do this by using **_mkcert_**.

#### **_Windows_**

**Step 1 (skip if you have Chocolatey already installed):** Install Chocolatey package manager (in the Powershell terminal with admin rights):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1')); [Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path','User') + ';' + [Environment]::GetEnvironmentVariable('ChocolateyInstall','Machine') + '\bin', 'User')"
```

**Step 2:** Install `mkcert` via Chocolatey (in the Powershell terminal with admin rights):

```powershell
choco install mkcert -y
```

**Step 3:** Install local CA (first time only) - **_this may NOT work for Firefox_** (click [here](https://wiki.mozilla.org/CA/AddRootToFirefox#Windows_Enterprise_Support) for Firefox solution):

```powershell
mkcert -install
```

**Step 4:** Create a certificate for localhost

```powershell
mkcert localhost
```

**Step 5:** Move the certificates to the project directory

```powershell
New-Item -ItemType Directory -Path .\src\certs -Force | Out-Null; Move-Item .\localhost.pem, .\localhost-key.pem -Destination .\src\certs\
```

#### **_Ubuntu/Debian_**

**Step 1:** Install mkcert & nss packages

```bash
apt install mkcert libnss3-tools
```

**Step 2:** Install local CA (first time only)

```bash
mkcert -install
```

**Step 3:** Create a certificate for localhost

```bash
mkcert localhost
```

**Step 4:** Move the certificates to the project directory

```bash
mkdir -p ./src/certs/ && mv localhost.pem localhost-key.pem ./src/certs/
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Set up .env file-->

### Set up .env file

Create a `.env` file in the src directory of the project and add the following variables:

```env
SW=true           #is the service worker enabled
SW_DEV=true       #is the service worker in development mode
SW_DESTROY=true   #should the service worker be destroyed on reload
SOURCE_MAP=false  #should the source map be generated
VITE_API_URL= <enter your API URL here>
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting started

### Install dependencies

-Install dependencies using **yarn**:

```bash
  yarn install
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Start the app

-For development mode, run the following command:

```bash
  yarn dev
```

The app will be available at port 5173: [https://localhost:5173](https://localhost:5173)

> [!WARNING] 
> **For PWA to work properly you need to run built version of the app. At this time the Firefox and Safari browsers do not support PWA on desktop [read more here](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable#browser_support)**

-For testing PWA functions, run the following command:

```bash
  yarn local
```

The app will be available at port 4173: [https://localhost:4173](https://localhost:4173)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

Readme by: [dziwuj](https://github.com/dziwuj)
