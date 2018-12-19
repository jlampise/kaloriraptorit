# Using Robotframework with Kaloriraptorit

## Linux Distribution
```
lsb_release -a
```
```
No LSB modules are available.
Distributor ID:	Ubuntu
Description:	Ubuntu 16.04.5 LTS
Release:	16.04
Codename:	xenial
```

## Install stuff

### Checked python

```
python3 --version
Python 3.5.2
```

### Install pip

```
sudo apt-get install python3-pip
```

### Upgrade pip

```
pip3 install pip
```

### Add to PATH

.profile:
```
if [ -d "$HOME/.local/bin" ] ; then
  PATH="$HOME/.local/bin:$PATH
  fi
```

### Check pip

```
pip --version
pip 18.1 from /home/jlampise/.local/lib/python3.5/site-packages/pip (python 3.5)
```

```
which pip
/home/jlampise/.local/bin/pip
```

### Install Robot Framework
```
pip install robotframework --user
```

### Install Selenium
```
pip install robotframework-seleniumlibrary --user
```

## Adding structure

### Add directory for tests and output

### Make script for running robot

Example: package.json:
```
  ...
  "scripts": {
    ...
    "robot": "robot --outputdir ../robot/output ../robot/test.robot"
    ...
  }
  ...
```

### Add output dir to `.gitignore`

### Add `test.robot` -file
