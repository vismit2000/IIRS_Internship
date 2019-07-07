# Project Title

A web based decision support system (DSS) using multi-criteria analysis technique to achieve the following task:

1.

2.

3.

# Description
----------------------

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Installing

1. Install pip3 (For installing python libraries)

```bash
sudo apt update

sudo apt install python3-pip
``` 

2. Install git

```bash
sudo apt install git
```

3. Geodjango installation
------------

## Configuring PostgreSQL

1. Switch over to the postgres account on your server by typing:

```bash
sudo -i -u postgres
```

2. Create a new user by typing:

```bash
createuser --interactive
```

Enter name of role to add: happy
Shall the new role be a superuser? (y/n) y

3. Create a New Database

```bash
createdb corey
psql -d postgres
```

Once logged in, you can get check your current connection information by typing:
```bash
postgres=# \conninfo
```

Output : You are connected to database "corey" as user "happy" via socket in "/var/run/postgresql" at port "5432".

4. Create username and password

```bash
sudo -u postgres psql -c "ALTER ROLE happy WITH password 'Vishal@2000'"
```

Or to create your own user to be linked with database, create a user using “postgres createuser” and give it a password and accordingly inside settings.py add username and password (because it will be used by django to connect to database)

## Install GDAL/OGR (Python geospatial libraries to work with raster data)

```bash
sudo add-apt-repository ppa:ubuntugis/ppa && sudo apt-get update
sudo apt-get update
sudo apt-get install gdal-bin
sudo apt-add-repository ppa:ubuntugis/ubuntugis-unstable
sudo apt-get update
sudo apt-get install python-gdal
```


### Installation
1. Clone or download the repository.
    ```bash
    git clone https://github.com/vismit2000/IIRS_Internship
    ```

3. Install required python packages given in the requirements.txt file.
    ```bash
    pip install -r requirements.txt
    ```
4. Run Django migrations.

    ```bash
    python manage.py makemigrations
    python manage.py migrate
    ```
5. Start the application.
    ```bash
    python manage.py runserver
    ```

6. Access the application at:

    http://localhost:8000 


##Admin details :

```
** Username : vishal
** Password : Vishal@2000
```

# Django MVC Architecture

The MVC is an architectural pattern that separates an application into three main logical components
    1. Model
    2. View
    3. Controller

Goal of each layer on the MVT architecture that Django uses :

M — Model: The goal of the Models is to handle the data. That means, it should be responsible for maintaining the integrity of the state of the object, and implement the behaviours that this object may have. That means, it is also responsible for changing the state of the object.

V — View: The view has few goals. First, it is responsible for getting the inputs that come via HTTP request. Secondly, it should be sending this to the process that will process that data and collect the output of the operation. And thirdly, it is responsible for processing the template and send the response back to client.
The view is not responsible for having the process itself, it is the controller. No business logic should live here. In fact, it should be the thinnest layer in our application.

T — Template: The template is there to define the markup that will be processed by the view. The template system that Django uses is sophisticated and allow extensions and few logical operations. Due to the high-level of customization that is possible here, it is very easy to add a lot of business logic to that. Template should deal only with the presentation aspect of our application.

![MVC](./mvc.png?raw=true "Model View Controller")

## MVC in web application

Controller – Programming on the server to direct and redirect the user from page to page

Views – What the end user sees on its browser

Model – Set of applications that take input data and put data into website’s data mix

## Web application

Issues related to web-based spatial decision support system:

    * Performance
    * Integration of various technologies
    *  Security
    * Interoperability

Server : A distant computer that provides services

Client : The computer the user is operating, which consumes services from a server

## Map Algebra

### Raster Data Analysis

In a raster data set, each cell represents a value at a given location. A grid cell could represent anything – temperature values or precipitation volume.

The map algebra tool is a cell-by-cell combination of raster data layers stacked on top of each other. A simple operation like addition or multiplication are applied to each raster cell location. Map algebra generates a new raster output based on the math-like expression.

Raster operations can be classified into global, zonal, focal and local operations.

### Local Operations

![Map Algebra](./mapAlg1.png?raw=true "Map Algebra")

![Map Algebra](./mapAlg2.png?raw=true "Map Algebra")

The value generated in the output raster is a function of cell values at the same location on in the input layers.

Here are examples of operations that can be used between the two raster layers:

    * Arithmetic operations (addition, subtraction, multiplication, division)
    * Statistical operations (minimum, maximum, average, median)
    * Relational operations (greater than, smaller than, equal to)
    * Trigonometric operations (sine, cosine, tangent, arcsine)
    * Exponential and logarithmic operations (exponent, logarithm)

![Matrix](./matrix.png?raw=true "Matrix")

## Visulaization of final raster result

Final image shows four suitability areas for habitat of swamp deer :

    * Highly suitable
    * Suitable
    * Moderately suitable
    * Least suitable

### Tech Stack used

1. Frontend - HTML, CSS, Javascript
2. Backend - Python, Django, GeoDjango
3. API used : [Leaflet](https://leafletjs.com/)


## Acknowledgments

* Kapil Oberoi Sir (IIRS)