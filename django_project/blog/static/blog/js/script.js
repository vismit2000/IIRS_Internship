function loaded(){
    $("#uploadImagesForm").submit(function(e){
        return false;
    });
}

function submitForm()
{
    console.log('Form submit is pressed!!!');
    var data = new FormData($('form').get(0));
    data['csrfmiddlewaretoken'] = getCookie('csrftoken');
    $.ajax({
        url: '/upload/',
        type: 'POST',
        data: data,
        cache: false,
        processData: false,
        // beforeSend: function(xhr) {
        //     xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        // },
        contentType: false,
        success: function(data) {
            console.log(data);
        }
    });
}

function openDialog() {
    document.getElementById('fileid').click();
}
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

    $('#paramDiv').append('<div><button onclick="makeTable(' + numDim + ');" class="dimSubmitBtn">Submit Dimensions</button></div>');
}

function makeTable(numDiv) {
    document.getElementById('paramDiv').style.display = 'none';
    document.getElementById('matrix').style.display = 'block';
    document.getElementById('importanceTable').style.display = "block";
    var rows = numDiv + 2;
    var columns = numDiv + 1;
    var form = document.getElementById("frm");

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (i == 0 && j == 0) {
                var input = $('<input>').attr({
                    class: 'matrix_cell',
                    id: i + '' + j,
                    value: 'Class'
                });
                input[0].readOnly = true;
                form.appendChild(input[0]);
                continue;
            }
            if (i == 0 && j != 0) {
                var input = $('<input>').attr({
                    class: 'matrix_cell',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[j - 1].value
                });
                input[0].readOnly = true;
                form.appendChild(input[0]);
                continue;
            } else if (j == 0 && i != 0 && i != rows - 1) {
                var input = $('<input>').attr({
                    class: 'matrix_cell',
                    id: i + '' + j,
                    value: document.getElementsByClassName('dimensions')[i - 1].value
                });
                input[0].readOnly = true;
                form.appendChild(input[0]);
                continue;
            }
            var a;
            if (i == j)
                a = 1;
            else
                a = 0;
            var input = $('<input>').attr({
                class: 'matrix_cell',
                id: i + '' + j,
                value: a
            });
            if (i == j)
                input[0].readOnly = true;

            form.appendChild(input[0]);

            if (i == rows - 1) {
                if (j == 0)
                    $('#' + i + '' + j).val('sum');
                else
                    $('#' + i + '' + j).val(0);

                document.getElementById(i + '' + j).style.marginTop = '2vh';
            }
        }
        var br = $('<br>')[0];
        form.appendChild(br);
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

$("#get").click(function() {
    console.log(getMatrix());
});

function getMatrix() {
    var rowNum = 0,
        colNum = 0;

    $("#frm").contents().each(function(i, e) {
        if (this.nodeName == "INPUT") {
            if (rowNum == 0)
                colNum++;
        } else {
            rowNum++;
        }
    });

    dimensions = {};
    dimensions['rowNum'] = rowNum;
    dimensions['colNum'] = colNum;
    return dimensions;
}

function arrSum(arr) {
    sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum;
}

const calcSum = () => {
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];
    arr = [];
    sum = 0;
    for (let j = 1; j < cols; j++) {
        arr = [];
        for (let i = 1; i < rows - 1; i++) {
            arr.push(Number($('#' + i + '' + j).val()));
        }
        sum = arrSum(arr);
        console.log(sum);
        $('#' + (rows - 1) + '' + j).val(sum);
    }
};

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
            entries += $('#' + i + '' + j).val();

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

const sendRequest = (url, method, data) => {
    let request = new XMLHttpRequest();
    var csrftoken = getCookie('csrftoken');
    request.onreadystatechange = () => {
        if (request.readyState == 4 && request.status == 200) {
            if(url == 'saveMatrix/')
                console.log('matrix saved successfully!!');
            else if(url == 'processImages/')
            {
                response = JSON.parse(request.response);
                console.log(response);
                var image = new Image();
                image.src = 'data:image/jpg;base64,';
                image.src+=response.image;
                
                document.body.appendChild(image);
            }
        }
    };
    request.open(method, url, true);
    request.setRequestHeader('X-CSRFToken', csrftoken);
    request.send(data);
};

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

function criteriaWeights()
{
    dimensions = getMatrix();
    rows = dimensions['rowNum'];
    cols = dimensions['colNum'];   
    rowSum = []   
    var rowsSumHtml = "<div style='position:absolute; top:70vh; left: 40vw;'>";
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

function displayFinalImage()
{
    inputs = document.getElementsByClassName('rowsSumInputs');
    valueArr = []
    for(let i=0; i<inputs.length; i++)
    {
        valueArr.push(inputs[i].value);
    }
    data = {'valueArr' : valueArr};
    sendRequest('processImages/', 'POST', JSON.stringify(data));
}