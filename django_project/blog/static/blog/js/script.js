// mapping table forn random index
const RI = {
    "1" : 0.00,
    "2" : 0.00,
    "3" : 0.58,
    "4" : 0.90,
    "5" : 1.12,
    "6" : 1.24,
    "7" : 1.32,
    "8" : 1.41,
    "9" : 1.45,
    "10" : 1.49
};

var mappedDimensions = [];
var currDimensionNum = 0;

var userMatrix = [] ;   //global variable to store user's initial input matrix

/**
 * funciton called after body is loaded , used to initilise wizard functionality
 */
function loaded(){
    $("#uploadImagesForm").submit(function(e){
        return false;
    });
    var ball = document.querySelectorAll('.ball');
    
    //popup 
    $(".popup img").click(function () {
        var $src = $(this).attr("src");
        $(".show").fadeIn();
        $(".img-show img").attr("src", $src);
    });
    
    $("span, .overlay").click(function () {
        $(".show").fadeOut();
    });

var tl = new TimelineMax({ repeat: -1, yoyo: true });
tl.staggerFromTo(ball, 1, {
      x: 0,
      y: 0,
      autoAlpha: 0,
      scale: .1
    }, {
      autoAlpha: 1,
      scale: 1,
      bezier: {
        type: 'soft',
        values: [{
          x: -50,
          y: -50
        }, {
          x: -100,
          y: 0
        }, {
          x: -50,
          y: 50
        }, {
          x: 0,
          y: 0
        },{
          x: -50,
          y: 50
        }, {
          x: 50,
          y: -50
        }, {
          x: 100,
          y: 0
        }, {
          x: 50,
          y: 50
        }, {
          x: 0,
          y: 0
        }]
      },
      ease: Power1.easeInOut,
      stagger: '0.1'
    });
}

/**
 * Function to upload images , uncomment for upload functionality
 */
// function submitForm()
// {
//     console.log('Form submit is pressed!!!');
//     var data = new FormData($('form').get(0));
//     data['csrfmiddlewaretoken'] = getCookie('csrftoken');
//     $.ajax({
//         url: '/upload/',
//         type: 'POST',
//         data: data,
//         cache: false,
//         processData: false,
//         contentType: false,
//         success: function(data) {
//             console.log(data);
//         }
//     });
// }

// function openDialog() {
//     document.getElementById('fileid').click();
// }


/**
 * Function is used to clear and again take dimensions inputs from user (Called on first page by Enter dimensions btn)
 */
function displayDimensions() {
    var dimDivs = document.getElementsByClassName('dimDiv');
    while (dimDivs[0]) {
        dimDivs[0].parentNode.removeChild(dimDivs[0]);
    }

    var submitDimBtn = document.getElementsByClassName('dimSubmitBtn');
    while (submitDimBtn[0])
        submitDimBtn[0].parentNode.removeChild(submitDimBtn[0]);

    var dimInput = document.getElementById('dimensionsValue');
    var numDim = dimInput.value;
    let dimensionsValues = ['Vegetation', 'Drainage', 'Road', 'Settlement'];
    for (var i = 0; i < numDim; i++) {
        if(i < dimensionsValues.length)
            $('#paramDiv').append('<div class="dimDiv"><input type="text" class="dimensions" value="'+dimensionsValues[i]+'" id="div' + (i + 1) + '"><a class="special myModalLink" onclick="selectRanges('+(i)+')">Select Ranges</a></div>');
        else
        $('#paramDiv').append('<div class="dimDiv"><input type="text" class="dimensions" value="" id="div' + (i + 1) + '"></div>');
    }

    $('#paramDiv').append('<div class="submitDimDiv"><a href="javascript:void(0)" onclick="makeTable(' + numDim + ');" class="dimSubmitBtn special">Submit Dimensions</a></div>');

    //=====================================Create mapped dimension matrix with number of rows = num of dims================
    mappedDimensions = new Array(numDim);
}

/**
 * this function creates a matrix with main diagonal as 1 (read only) and rest 0 (editable by user)
 * @param {integer} numDiv - number of dimensions user entered
 */
function makeTable(numDiv) {
    let dimDivs = document.getElementsByClassName('dimDiv');    
    let numDim = dimDivs.length + 1;
    userMatrix = new Array(numDim);
    for(let i=0; i<numDim; i++)
    {
        userMatrix[i] = new Array(numDim);
    }
    userMatrix[0][0] = "Class";
    for(let j=1; j<numDim; j++)
    {
        userMatrix[0][j] = dimDivs[j-1].children[0].value;
        userMatrix[j][0] = dimDivs[j-1].children[0].value;
    }
    for(let i=1; i<numDim; i++)
    {
        for(let j=1; j<numDim; j++)
        {
            if(i==j)
                userMatrix[i][j] = 1;
            else
                userMatrix[i][j] = 0;
        }
    }

    document.getElementById('paramDiv').style.display = 'none';
    document.getElementById('matrix').style.display = 'flex';
    document.getElementById('importanceTable').style.display = "block";
    var rows = numDiv + 2;
    var columns = numDiv + 1;
    var form = document.getElementById("frm");

    for (let i = 0; i < rows; i++) {
        var rowDiv = document.createElement('div');        
        if (i == rows-1)
            rowDiv.style.marginTop="2vh";
        for (let j = 0; j < columns; j++) {
            if (i == 0 && j == 0) {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: 'Class',
                    readOnly: true
                });
                
                rowDiv.appendChild(input[0]);
                continue;
            }
            if (i == 0 && j != 0) {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[j - 1].value,
                    readOnly: true
                });
                
                rowDiv.appendChild(input[0]);
                continue;
            } else if (j == 0 && i != 0 && i != rows - 1) {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[i - 1].value,
                    readOnly: true
                });
                
                rowDiv.appendChild(input[0]);
                continue;
            }
            var a;
            if (i == j)
                a = 1;
            else
                a = 0;

            if((i == rows-1) && (j == 0))
            {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: 'Sum',
                    readOnly: true
                });
                rowDiv.appendChild(input[0]);
                continue;
            }

            var input = $('<input>').attr({type: 'number' ,
                class: 'matrix_cell effect-9',
                id: i + '' + j,
                value: a
            });
            // if (i == j)
                // input[0].readOnly = true;

            rowDiv.appendChild(input[0]);
        }
        // var br = $('<br>')[0];
        form.appendChild(rowDiv);
    }
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < columns; j++) {
            $('#' + i + '' + j).on('keyup', (e) => {
                if (e.keyCode == 13) {
                    //  console.log('You pressed enter inside elem with id' + i + '' + j);
                    document.getElementById(j + '' + i).value = (1 / (document.getElementById(i + '' + j).value)).toFixed(3);
                }
            });
        }
    }



    let inputs = document.getElementsByClassName('matrix_cell');
    for(let i=0; i<inputs.length; i++)
    {
        // console.log(i);
        // console.log(inputs[i]);        
        if(inputs[i].type === "number")
        {
            inputs[i].max = 9;
            inputs[i].min = 0;
            inputs[i].oninput = function () {
                var max = parseInt(this.max);
                if (parseInt(this.value) > max) {
                    swal("Sorry!", "Please enter a value between 0-9", "error");
                    this.value = "";
                }
            }
        }        
    }    
}

/**
 * returns number of rows and columns in user's input matrix
 */
function getMatrix() {
    var rowNum = 0,
        colNum = 0;

    $("#frm").contents().each(function(i, e) {
        if (this.nodeName == "DIV") {
            rowNum++;
        }
    });
    colNum = document.getElementsByClassName('matrix_cell effect-9').length;
    colNum/=rowNum;
    dimensions = {};
    dimensions['rowNum'] = rowNum;
    dimensions['colNum'] = colNum;
    return dimensions;
}

/**
 * takes an array and returns it's sum
 * @param {Array} arr array of numbers to be summed up
 */
function arrSum(arr) {
    sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

/**
 * sums each columns of matrix and displays sum in last row
 */
const calcSum = () => {
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];
    arr = [];
    sum = 0;
    let temp = new Array(rows-1);
    for (let i = 0; i < rows-1; i++) {
        temp[i] = new Array(cols);
        for (let j = 0; j < cols; j++) {
            temp[i][j] = $('#'+i+''+j).val();
        }
    }
    userMatrix = temp;  
    for (let j = 1; j < cols; j++) {
        arr = [];
        for (let i = 1; i < rows - 1; i++) {
            arr.push(Number($('#' + i + '' + j).val()));
        }
        sum = arrSum(arr);
        //console.log(sum);
        $('#' + (rows - 1) + '' + j).val(sum);
    }
    //console.log(userMatrix);
};

/**
 * normalizes matrix by dividing each entry by corresponding column sum
 */
const normalizeMatrix = () => {
    document.getElementById('importanceTable').style.display='none';
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];
    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols; j++) {
            $('#' + i + '' + j).val(($('#' + i + '' + j).val() / $('#' + (rows - 1) + '' + j).val()).toFixed(3));
        }
    }
};

/**
 * save matrix in the database
 */
const saveMatrix = () => {
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];
    numOfDimensions = dimensions['rowNum'] - 2;
    dimensionsString = '';
    mappedDimensionsString = '';

    for(let i=0; i<numOfDimensions; i++)
    {
        for(let j=0; j<mappedDimensions['dimension'+i].length; j++)
        {
            mappedDimensionsString+=mappedDimensions['dimension'+i][j];
            mappedDimensionsString+=" ";
        }
        mappedDimensionsString+="#";
    }

    // console.log(mappedDimensionsString);

    entries = '';
    for (let i = 1; i < cols; i++) {
        dimensionsString += $('#' + 0 + '' + i).val();

        if (i != cols - 1)
            dimensionsString += '$';
    }
    //console.log(dimensionsString);

    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols; j++) {
            entries += userMatrix[i][j];

            if (!((i == rows - 2) && (j == cols - 1)))
                entries += ' ';
        }
    }
    //console.log(entries);
    data = {};
    data['numOfDimensions'] = numOfDimensions;
    data['dimensionsString'] = dimensionsString;
    data['entries'] = entries;
    data['mappedDimensionsString'] = mappedDimensionsString;

    sendRequest('saveMatrix/', 'POST', JSON.stringify(data));
};

/**
 * sends an XMLHttpRequest to url
 * @param {string} url - url to be send data to
 * @param {string} method - 'GET'/'POST'
 * @param {Object} data - JSON object to be sent to backend
 */
const sendRequest = (url, method, data) => {
    let request = new XMLHttpRequest();
    //add csrf token to prevent csrf error
    var csrftoken = getCookie('csrftoken');
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            //success response
            if(url == 'saveMatrix/')
            {
                swal("Great!", "Matrix saved successfully!!", "success");
            }
            else if(url == 'processImages/')
            {
                document.getElementById('loader').style.display='none';
                response = JSON.parse(request.response);
                if(response.error == 'false')
                {
                    // sendRequest('/getImageForMap/','POST');
                    document.getElementById('mapLink').click();
                }
            }
        }
    };
    //open request
    request.open(method, url, true);
    //set csrf header
    request.setRequestHeader('X-CSRFToken', csrftoken);
    //send request
    request.send(data);
};

/**
 * to get cookie of csrf token to be sent in request
 * @param {string} name - name to get cookie of
 */
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/**
 * generate criteria weights by using formula and show them
 */
function criteriaWeights()
{
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];   
    rowSum = []   
    var criteriaWeightsDiv = document.getElementById('criteriaWeightsDiv');
    criteriaWeightsDiv.innerHTML="";
    for (let i = 1; i < rows - 1; i++) {
        var innerDiv = document.createElement('div');
        var rowsSumHtml=document.createElement('input');
        rowSum[i-1] = 0;
        for (let j = 1; j < cols; j++) {
            // console.log([i,j,$('#' + i + '' + j).val()]);
            rowSum[i-1] += Number($('#' + i + '' + j).val());    
        }
        rowSum[i-1]/=(cols-1);
        rowsSumHtml.type="text";
        rowsSumHtml.classList.add("rowsSumInputs");
        rowsSumHtml.value=rowSum[i-1].toFixed(3);
        innerDiv.appendChild(rowsSumHtml);
        criteriaWeightsDiv.appendChild(innerDiv);
    }
    
    // console.log(rowsSumHtml);
}

/**
 * hides loader and shows image
 */
function displayFinalImage()
{
    document.getElementById('loader').style.display='block';
    inputs = document.getElementsByClassName('rowsSumInputs');
    valueArr = []
    for(let i=0; i<inputs.length; i++)
    {
        valueArr.push(inputs[i].value);
    }
    data = {'valueArr' : valueArr};
    sendRequest('processImages/', 'POST', JSON.stringify(data));
}

//-----------------------------------------Steps Tracker JS----------------------------------------------

$('#step-list li.option').click(function () {
    $(this).addClass('active');
    var stepFor = $(this).attr('for');
    $('.billing__main__content__forms__div').removeClass('active');
    $('#' + stepFor).addClass('active');

    if(stepFor == 'extra-info'){
        $('#step-list li.warning').css('display','none');
    }

    var dataStep = $(this).attr('data-step');
    $('#step-list li.option').each(function() {
        if($(this).attr('data-step') > dataStep){
            $(this).removeClass('active');
        }else{
            $(this).addClass('active');
        }
        if($(this).attr('data-step') >= dataStep){
            $(this).removeClass('done');
        }else{
            $(this).addClass('done');
        }
    });
});
$('.billing__main__content__forms__btn').click(function () {
    var formsBtnId = $(this).attr('data-continue');

    $("li[for = '" + formsBtnId + "']").trigger( "click" );


    var findLiStep = $("li[for = '" + formsBtnId + "']").attr('data-step');

    $('#step-list li.option').each(function() {
        if($(this).attr('data-step') >= findLiStep){
            $(this).removeClass('done');
        }else{
            $(this).addClass('done');
        }
    });
});

$('#extra-info-view').click(function () {
    $('#step-list li.warning').css('display','none');
});


$('.billing__main__search span').click(function () {
    if($(this).hasClass('clicked')){
        $(this).removeClass('clicked');
        $(this).html('YENİ AKTİVİTE ARA <i class="fa fa-angle-down" aria-hidden="true"></i>');
        $('.billing__main__header__default').addClass('active');
        $('.billing__main__header__search').removeClass('active');
    }
    else{
        $(this).addClass('clicked');
        $(this).html('ARAMAYI KAPAT <i class="fa fa-times" aria-hidden="true"></i>');
        $('.billing__main__header__default').removeClass('active');
        $('.billing__main__header__search').addClass('active');
    }
});

//-----------------------------------------Steps Tracker JS Ends----------------------------------------------

/**
 * to display a particular button on the top of matrix as wizard is followed
 * @param {number} val 
 */
function displayFunctnBtn(val)
{
    let btns = document.getElementsByClassName('functionBtn');
    for(let i=0; i<btns.length; i++)
    {
        if(i == val)
            btns[i].style.display = 'inline';
        else
            btns[i].style.display = 'none';
    }
}

/**
 * finds consistency and checks if it's within threshold value and displays proper message accordingly
 */
function checkConsistency()
{
    // console.log(userMatrix);
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];
    let matrix = new Array(rows-2);
    for(let i=0;i<rows-2; i++)
    {
        matrix[i] = new Array(cols-1);
        for(let j=0; j<cols-1; j++)
        {
            matrix[i][j] = userMatrix[i+1][j+1];
        }
    }
    sum = 0;

    let weightsArray = new Array(rows-2);
    let weights = document.getElementsByClassName('rowsSumInputs');
    for(let i=0; i<weights.length; i++)
    {
        weightsArray[i] = weights[i].value;
    }

    let sumArr = new Array(rows-2);
    let x = 0;
    for (let i = 1; i < rows-1; i++) {
        sumArr[i-1] = 0;
        for (let j = 1; j < cols; j++) {
            matrix[i-1][j-1]*=weightsArray[j-1];
            sumArr[i-1] += matrix[i-1][j-1];
        }
        sumArr[i-1]/=weightsArray[i-1];
        x+=sumArr[i-1];
    }   
    const lambda = (x/(rows-2)).toFixed(3);
    //console.log(lambda);
    const CI = ((lambda-(rows-2))/((rows-2)-1)).toFixed(3);
    //console.log(CI);
    const CR = (CI/RI[rows-2]).toFixed(3);
    //console.log(CR);
    if(CR<.1){
        swal("Great!", "Consistency Ratio is = "+CR, "success");
        document.getElementById("consistencyValue").innerHTML="";
        document.getElementById("consistencyValue").innerHTML="Consistency Ratio = Consistency Index (CI) / Random Index (RI)";
        document.getElementById("consistencyValue").innerHTML+="<br><br>Consistency Ratio is "+CR;
        let elems =  document.getElementsByClassName('functionalityLinksLI');
        elems[elems.length-1].style.pointerEvents = 'all';
        elems[elems.length-2].style.pointerEvents = 'all';
    }
    else
    {
        let elems =  document.getElementsByClassName('functionalityLinksLI');
        elems[elems.length-1].style.pointerEvents = 'none';
        elems[elems.length-2].style.pointerEvents = 'none';
        if(!isNaN(CR))
            swal("Sorry!", "Consistency Ratio is = "+CR+"!! Please enter values again :(", "error");
        else
            swal("Sorry!", "Invalid matrix entries, please enter again", "error");
        for(let i=0; i<userMatrix.length; i++)
        {
            for(let j=0; j<userMatrix[i].length; j++)
            {
                $('#'+(i)+''+(j)).val(userMatrix[i][j]);
            }
        }
        for(let j=1; j<=userMatrix[0].length; j++)
            $('#'+(userMatrix.length)+''+(j)).val(0);
    }
    //console.log(matrix);
    //console.log(x);
}

function initializeMatrix()
{
    dimensions = getMatrix();
    rows = dimensions['rowNum']-1;
    cols = dimensions['colNum'];
    for (let i = 0; i < rows ; i++) {
        for (let j = 0; j < cols; j++) {
            $('#'+i+''+j).val(userMatrix[i][j]);
        }   
    }   
}

function selectRanges(dimensionNum)
{
    document.getElementById('hqrTable').style.display = "block";
    currDimensionNum = dimensionNum;
    let texts= [
        [
            [["Khair plantation",3],["Grassland",2]],
            [["Scrub",3], ["Moist deciduous forest",3]],
            [["Khair-Shisham Forest",3],["Waterbody",3]],
            [["Eucalyptus",3],["Riverbed",3]],
            [["Teak plantation",4],["Mixed plantation",3]],
            [["Agriculture-I",3],["Settlement",4]],
            [["Orchard",4], ["Forest depot",4]],
            [["Shisham plantation",3], ["Canal",4]],
            [["Wetland",1], ["Agriculture-II",1]]
        ],
        [
            [["< 1000",1], ["1000 - 2000",2]],
            [["2000 - 3000",3],["3000 - 4000",4]]
        ],
        [
            [["< 1000",4], ["1000 - 2000",3]],
            [["2000 - 3000",2],["3000 - 4000",1]]
        ],
        [
            [["< 1000",4], ["1000 - 2000",3]],
            [["2000 - 3000",2],["3000 - 4000",1]]
        ]
    ];
    
    let headings = [
        ["Vegetation Type","Habitat Quality Rating(HQR)"],
        ["Distance to drainage(in m)","Habitat Quality Rating(HQR)"],
        ["Distance to road(in m)","Habitat Quality Rating(HQR)"],
        ["Distance to settlement(in m)","Habitat Quality Rating(HQR)"]
    ];

    // console.log('hi');
    document.getElementsByClassName('myModal')[0].classList.toggle('is-visible');
    // console.log(dimensionNum);
    let numOfRows = 0;
    let numOfCols = 0;
    let rangeInputMatrix = null;
    // 0 => Vegetation, 1 => Drainage , 2 => Road, 3 => Settlement
    switch (dimensionNum) {
        case 0:
        case "0":
            numOfRows = 9;
            numOfCols = 2;
        break;
        
        case 1:
        case "1":
            numOfRows = 2;
            numOfCols = 2;
            // console.log(11111);
        break;

        case 2:
        case "2":
            numOfRows = 2;
            numOfCols = 2;
            // console.log(22222);
        break;

        case 3:
        case "3":
            numOfRows = 2;
            numOfCols = 2;
            // console.log(33333);
        break;

        default:
            numOfRows = 0;
            numOfCols = 0;
        break;
    }

    rangeInputMatrix = new Array(numOfRows);
            for(let i=0; i<numOfRows; i++)
            {
                rangeInputMatrix[i] = new Array(numOfCols);
                for(let j=0; j<numOfCols; j++)
                {
                    rangeInputMatrix[i][j] = texts[dimensionNum][i][j];
                }
            }

    var elements = document.getElementsByClassName("rangeInput");
    while (elements[0]) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    let submitBtn = null;
    for(let i=0; i<numOfRows; i++)
    {
        row = document.createElement('div');
        for(let j=0; j<numOfCols; j++)
        {
            colHead = document.createElement('input');
            colHead.type="text";
            colHead.readOnly=true;
            colHead.value = rangeInputMatrix[i][j][0];
            colHead.classList.add('rangeInput');            

            colInput = document.createElement('input');
            colInput.type="number";
            colInput.min=1;
            colInput.max = 4 ;
            colInput.value = rangeInputMatrix[i][j][1];
            colInput.oninput = function () {
                var max = parseInt(this.max);
                if ((parseInt(this.value) > colInput.max) || (parseInt(this.value) < colInput.min)){
                    swal("Sorry!", "Please enter a value between 1-4", "error");
                    this.value = "";
                }
            }
            // colInput.value=0;
            colInput.classList.add('rangeInput');
            colInput.classList.add('rangeInputBox');
            colInput.classList.add('dimension'+dimensionNum);
            // console.log('col',colInput);
            row.appendChild(colHead);
            row.appendChild(colInput);
        }
        submitBtn = document.getElementsByClassName('myModal-toggle')[2];
        if(i == 0)
        {
            headingRow = document.createElement('div');
            colHeading = document.createElement('input');
            colHeading.type="text";
            colHeading.readOnly=true;
            colHeading.value = headings[dimensionNum][0];
            colHeading.classList.add('rangeInput');    
            colHeading.classList.add('headings');
            colInputHeading = document.createElement('input');
            colInputHeading.classList.add('headings');
            colInputHeading.type="text";
            colInputHeading.value = headings[dimensionNum][1];
            // colInput.value=0;
            colInputHeading.classList.add('rangeInput');

            // console.log('col',colInput);
            headingRow.appendChild(colHeading);
            headingRow.appendChild(colInputHeading);
            submitBtn.parentNode.insertBefore(headingRow,submitBtn);
        }
        submitBtn.parentNode.insertBefore(row,submitBtn);
    }
}

function saveDimensions(dimensionNum)
{
    mappedDimensions[dimensionNum] = [];
    colInput = document.getElementsByClassName(dimensionNum);
    // console.log(colInput);
    for(let i=0; i<colInput.length; i++)
    {
        // console.log(colInput[i].value);
        mappedDimensions[dimensionNum].push(colInput[i].value);
    }
    // console.log(mappedDimensions[dimensionNum]);
}

function toggleModal()
{
    document.getElementById('hqrTable').style.display = "none";
    document.getElementById('my-modal').classList.toggle('is-visible');
    saveDimensions('dimension'+currDimensionNum);
}