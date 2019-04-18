
window.onload = function() {

    // vars
    var goal = 250;
    var textArea = document.querySelector('#textArea');
    var count = document.querySelector('#count');
    var wordGoal = document.querySelector('#word-goal');
    var saveStatus = document.querySelector('#save-status');
    var textArea = document.querySelector('#textArea');
    var todaysDate = document.querySelector('#todays-date');
    var timeoutId;

    var tx = document.getElementsByTagName('textarea');

    for (var i = 0; i < tx.length; i++) {
    tx[i].setAttribute('style', 'height:' + (tx[i].scrollHeight) + 'px;overflow-y:hidden;');
    tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
    }

    
    // app functions
    //
    function WordCount(str) {
        return str.split(' ')
        .filter(function(n) { return n != '' })
        .length;
    }

    function updateCount() {
        var text = textArea.value;
        var wordCount = WordCount(text);
        count.innerHTML = WordCount(text);
        successCheck(wordCount);
    }

    // eventListeners
    // 
    textArea.addEventListener('keyup', function(e) {
        
        if(e.keyCode === 32) {
            updateCount();

            if (timeoutId) clearTimeout(timeoutId);
        
            // Set timer that will save comment when it fires.
            timeoutId = setTimeout(saveDraftToStorage, 3000);
        }
    });

    function successCheck(wordCount) {
        if(wordCount < goal) {
            count.classList.remove('success');
        } else {
            count.classList.add('success');
        }
    }

    function setInitialContent() {
        var date = new Date(new Date().toDateString()).toString();
        var rawDate = new Date();
        var data = JSON.parse(localStorage.getItem('drafts'));

        if (!data) {
            textArea.innerHTML = 'get started writing!';
        } else {
            var pos = data.map(function(e) { return e.date; }).indexOf(date);
            textArea.innerHTML = data[pos].draft
            todaysDate.innerHTML = rawDate.getMonth() + '-' + rawDate.getDay()  + '-' + rawDate.getFullYear()
            textArea.dispatchEvent(new Event('change'));

        }
    }

    function saveDraftToStorage() {
        var draft = textArea.value;
        var data = JSON.parse(localStorage.getItem('drafts'));
        var date = new Date(new Date().toDateString()).toString();
        var obj = {
                draft: draft,
                date: date
            }

        if(data === null) { 
            var arry = [];
            arry.push(obj);
            localStorage.setItem('drafts', JSON.stringify(arry))
        } else {
            var pos = data.map(function(e) { return e.date; }).indexOf(date);
            
            // if date is not found. push new record for that date // 
            if(pos === -1) {
                var obj = {
                    draft: draft,
                    date: date
                }
                data.push(obj);
                localStorage.setItem('drafts', JSON.stringify(data));
                saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        saveStatus.innerHTML = '';
                    }, 2000)
                
                // update draft if date already exist // 
                } else {
                    data[pos].draft = draft
                    localStorage.setItem('drafts', JSON.stringify(data))
                    saveStatus.innerHTML = 'post saved';
                    setTimeout(function() {
                        saveStatus.innerHTML = '';
                    }, 2000)
                }

        }        
    }


    // setup
    function init() {
      setInitialContent();   
      count.innerHTML = WordCount(textArea.innerHTML)
    }

    init();

}

