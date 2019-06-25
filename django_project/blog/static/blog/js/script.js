
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
    for (var i = 0; i < numDim; i++) {
        $('#paramDiv').append('<div class="dimDiv"><input type="text" class="dimensions" id="div' + (i + 1) + '"></div>');
    }

    $('#paramDiv').append('<div class="submitDimDiv"><a href="javascript:void(0)" onclick="makeTable(' + numDim + ');" class="dimSubmitBtn special">Submit Dimensions</a></div>');
}

/**
 * this function creates a matrix with main diagonal as 1 (read only) and rest 0 (editable by user)
 * @param {integer} numDiv - number of dimensions user entered
 */
function makeTable(numDiv) {
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
                    value: 'Class'
                });
                input[0].readOnly = true;
                rowDiv.appendChild(input[0]);
                continue;
            }
            if (i == 0 && j != 0) {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[j - 1].value
                });
                input[0].readOnly = true;
                rowDiv.appendChild(input[0]);
                continue;
            } else if (j == 0 && i != 0 && i != rows - 1) {
                var input = $('<input>').attr({type: 'text' ,
                    class: 'matrix_cell effect-9',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[i - 1].value
                });
                input[0].readOnly = true;
                rowDiv.appendChild(input[0]);
                continue;
            }
            var a;
            if (i == j)
                a = 1;
            else
                a = 0;

            if((i == rows-1) && (j == 0))
                a = 'sum';

            var input = $('<input>').attr({type: 'text' ,
                class: 'matrix_cell effect-9',
                id: i + '' + j,
                value: a
            });
            if (i == j)
                input[0].readOnly = true;

            rowDiv.appendChild(input[0]);
        }
        // var br = $('<br>')[0];
        form.appendChild(rowDiv);
    }
    for (let i = 1; i < rows; i++) {
        for (let j = 1; j < columns; j++) {
            $('#' + i + '' + j).on('keyup', (e) => {
                if (e.keyCode == 13) {
                    console.log('You pressed enter inside elem with id' + i + '' + j);
                    document.getElementById(j + '' + i).value = (1 / (document.getElementById(i + '' + j).value)).toFixed(3);
                }
            });
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
    console.log('arrSum called');
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
    console.log('called');
    dimensions = getMatrix();
    console.log(dimensions);
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
            console.log('hi');
            arr.push(Number($('#' + i + '' + j).val()));
        }
        sum = arrSum(arr);
        console.log(sum);
        $('#' + (rows - 1) + '' + j).val(sum);
    }
    console.log(userMatrix);
};

/**
 * normalizes matrix by dividing each entry by corresponding column sum
 */
const normalizeMatrix = () => {
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
    entries = '';
    for (let i = 1; i < cols; i++) {
        dimensionsString += $('#' + 0 + '' + i).val();

        if (i != cols - 1)
            dimensionsString += '$';
    }
    console.log(dimensionsString);

    for (let i = 1; i < rows - 1; i++) {
        for (let j = 1; j < cols; j++) {
            entries += userMatrix[i][j];

            if (!((i == rows - 2) && (j == cols - 1)))
                entries += ' ';
        }
    }
    console.log(entries);
    data = {};
    data['numOfDimensions'] = numOfDimensions;
    data['dimensionsString'] = dimensionsString;
    data['entries'] = entries;

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
                    sendRequest('/getImageForMap/','POST');
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
    var rowsSumHtml = "<div id='weightDiv' style='position:absolute; top:70vh; left: 40vw;'>";
    for (let i = 1; i < rows - 1; i++) {
        rowSum[i-1] = 0;
        for (let j = 1; j < cols; j++) {
            console.log([i,j,$('#' + i + '' + j).val()]);
            rowSum[i-1] += Number($('#' + i + '' + j).val());    
        }
        rowSum[i-1]/=(cols-1);
        rowsSumHtml+='<input type="text" class="rowsSumInputs" value="'+rowSum[i-1].toFixed(3)+'" readonly><br>';
    }
    rowsSumHtml+="</div>";
    console.log(rowsSumHtml);
    $('#frm').after(rowsSumHtml);
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
    console.log(userMatrix);
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
    console.log(lambda);
    const CI = ((lambda-(rows-2))/((rows-2)-1)).toFixed(3);
    console.log(CI);
    const CR = (CI/RI[rows-2]).toFixed(3);
    console.log(CR);
    if(CR<.1){
        swal("Great!", "Consistency Ratio is = "+CR, "success");
        let elems =  document.getElementsByClassName('functionalityLinks');
        elems[elems.length-1].style.pointerEvents = 'all';
        elems[elems.length-2].style.pointerEvents = 'all';
    }
    else
    {
        swal("Sorry!", "Consistency Ratio is = "+CR+"!! Please enter values again :(", "error");
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
    console.log(matrix);
    console.log(x);
}

