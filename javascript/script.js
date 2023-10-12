$(document).ready(function(){
    // for right click
    document.oncontextmenu = function(){
        return false;
    };
    let grid_width;
    let grid_height;
    let mine_count;
    let start_time;

    // initialize modal
    let myModal = new bootstrap.Modal(("#mymodal"), {});

    // append 8x8 or 16x16 mineseeper board
    $("#Play").click(function(){
        let difficulty = $("#difficulty").val();
        
        if (difficulty == "Please Select Difficulty"){
            myModal.show();
            $("#alertheading").text(difficulty);
            return
        } else if (difficulty == "8x8") {
            grid_height = 8;
            grid_width = 8;
            mine_count = 10;
        } else if (difficulty == "16x16"){
            grid_height = 16;
            grid_width = 16;
            mine_count = 40;
        }

        // 2d Array of 8x8 and 16x16
        window.grid = new Array(grid_height).fill(null).map(() => 
        new Array(grid_width).fill(false));
        window.revealed = new Array(grid_height).fill(null).map(() =>
        new Array(grid_width).fill(false));
        window.flagged = new Array(grid_height).fill(null).map(()=>
        new Array(grid_width).fill(false));
        // console.log(revealed)
        $("#minescount").text("Mines : " + mine_count);

        // remaining cell 
        window.remainingcells = grid_width * grid_height - mine_count;
        $("#select-section").hide();
        startgame() //call back for start game

    });

    // start game 
    function startgame(){
        start_time = new Date();
        
        for (let i=0; i<mine_count; i++){
            let x;
            let y;
            do {
                x = Math.floor(Math.random() * grid_width);
                y = Math.floor(Math.random() * grid_height);              
            } while (grid[y][x]);
                grid[y][x] = true;
        };
        for (let y = 0; y < grid_height; y++){
            for (let x = 0; x< grid_width; x++){
                if (grid_width == "8"){
                    $(".grid8").append(`<div class="cell" data-x="${x}" data-y="${y}"></div>`)
                }else if (grid_width == "16"){
                    $(".grid16").append(`<div class="cell" data-x="${x}" data-y="${y}"></div>`)
                }
            }
        }
    };

    // event mousedown for all cell
    $('#minesweeperboard').on("mousedown", ".cell", function(event) {
        let x = parseInt($(this).attr('data-x'));
        let y = parseInt($(this).attr('data-y'));

        if (event.button == 0) {
            if (!flagged[y][x] == true && !revealed[y][x] == true) {
              revealcell(x, y);//callback for reveal cell 
            }
        } else if (event.button == 2) {
            toggleflag(x, y);// callback for toggle flag
            return false; 
        } 

    });



    // for reveal cell 
    function revealcell(x, y) {
        if (x < 0 || x >= grid_width || y < 0 || y >= grid_height || revealed[y][x]) {
            return;
        }

        revealed[y][x] = true;
        remainingcells--;
        console.log(revealed)
        //  if cell is flagged then remove flag and count 
        if (flagged[y][x] == true) {
            flagged[y][x] = false;
            $(`.cell[data-x=${x}][data-y=${y}]`).removeClass('flagged');
            const flaggedCount = countflag();// call back for count flag 
            $("#flagcounts").text("flags: " + flaggedCount);
        }

        // reveal cell mine 
        if (grid[y][x] == true) {
            revealmines()// call back for reveal mine when game over
                myModal.show();
                $("#alertheading").text("GameOver!");
        } 

        // for win 
        else if (remainingcells == 0){
            revealmines() // call back for reveal mine when won game
                let totaltime = calculatetotaltime(); // call back for calculate total time
                myModal.show();
                $("#alertheading").text("You Won!");
                $("#score").text("Score: " + totaltime + " seconds")
        } 
        // for count revealed cells number 
        else {
            const number_count = countnumber(x, y);// call back for reveal cell number 
            $(`.cell[data-x=${x}][data-y=${y}]`).addClass('revealed').text(number_count);
            if (number_count === 0) {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        revealcell(x + dx, y + dy);
                    }
                } if (flagged[y][x] == true){
                    toggleflag(x,y)
                } 
            }
        }
    };

    // toggle flag 
    function toggleflag(x, y){
        if (!revealed[y][x] == true) { 
            flagged[y][x] = !flagged[y][x];
            $(`.cell[data-x=${x}][data-y=${y}]`).toggleClass('flagged');
            const flaggedCount = countflag();//call back for count flag
            $("#flagcounts").text("flags: " + flaggedCount);
        }
    };

    // calculate total time 
    function calculatetotaltime(){
        let end_time = new Date();
        let total_time = (end_time - start_time)/1000;
        return total_time.toFixed(2)
    };

    // count flag 
    function countflag(){
        let count = 0;
        for (let y = 0; y < grid_height; y++) {
            for (let x = 0; x < grid_width; x++) {
                 if (flagged[y][x] == true){
                    count++;
                }
            }
        }
        return count;
    };

    // count reveald cell number
    function countnumber(x, y) {
        let count = 0;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (x + dx >= 0 && x + dx < grid_width && y + dy >= 0 && y + dy < grid_height) {
                    if (grid[y + dy][x + dx]) {
                        count++;
                    }
                }
            }
        }
        return count;
      };

    // for reveal mine when game over
    function revealmines() {
        let revealedmines = 0;
        for (let y = 0; y < grid_height; y++) {
            for (let x = 0; x < grid_width; x++) {
                if (grid[y][x] == true) {
                    $(`.cell[data-x=${x}][data-y=${y}]`).addClass('mined');
                    revealedmines++;
                }
            }
        }
    };

    // play again click event 
    $("#playagain").on("click", function playAgain() {
        location.reload();
      })
});

