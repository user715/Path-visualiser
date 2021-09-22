var screenWidth=window.innerWidth-100;
var screenHeight=window.innerHeight-document.querySelector("header").style.height-200;

var boxEdge=20;

var rows=Math.floor(screenHeight/boxEdge);
var cols=Math.floor(screenWidth/boxEdge);

var container=document.getElementById("container");
container.style.height=rows*boxEdge+"px";
container.style.width=cols*boxEdge+"px";

var grid=new Array(rows);
var UI_wall=false;

document.onmousedown=function () { UI_wall=true; }
document.onmouseup=function () { UI_wall=false; }

var source={"r":0,"c":0};
var destination={"r":0,"c":0};

var user_input=document.querySelector("#user_input");

for(var i=0;i<rows;i++)
{
    grid[i]=new Array(cols);
    var tempRowContainer=document.createElement("div");
    tempRowContainer.className="rowContainer";
    tempRowContainer.style.boxSizing="border-box";
    container.appendChild(tempRowContainer);
    for(var j=0;j<cols;j++)
    {
        grid[i][j]=0;
        var tempBox=document.createElement("div");
        tempBox.id=i+" "+j;
        tempBox.className="box";
        tempBox.style.height=boxEdge+"px";
        tempBox.style.width=boxEdge+"px";
        tempBox.style.float="left";
        tempBox.style.backgroundColor="rgb(200,200,200)";
        tempBox.style.border="1px solid rgb(50,50,50)";
        tempBox.style.boxSizing="border-box";
        tempBox.onmouseenter=function ()
        {
            if(UI_wall)
            {
                var id=this.id.split(" ");
                var i=parseInt(id[0]);
                var j=parseInt(id[1]);
                if(user_input.value=="3")
                {
                    grid[i][j]=0;
                    this.style.backgroundColor="rgb(200,200,200)";
                }
                else if(user_input.value=="0")
                {
                    grid[i][j]=1;
                    this.style.backgroundColor="rgb(0,0,0)";
                }
            }
        }
        tempBox.onmousedown=function ()
        {
            UI_wall=true;
            var id=this.id.split(" ");
            var i=parseInt(id[0]);
            var j=parseInt(id[1]);
            if(user_input.value=="3")
            {
                grid[i][j]=0;
                this.style.backgroundColor="rgb(200,200,200)";
            }
            else if(user_input.value=="0")
            {
                grid[i][j]=1;
                this.style.backgroundColor="rgb(0,0,0)";
            }
            else if(user_input.value=="1")
            {
                document.getElementById(source.r+" "+source.c).innerHTML="";
                this.innerHTML="S";
                source.r=i;
                source.c=j;
            }
            else{
                document.getElementById(destination.r+" "+destination.c).innerHTML="";
                this.innerHTML="D";
                destination.r=i;
                destination.c=j;
            }
        }
        tempBox.style.userSelect="none";
        tempRowContainer.appendChild(tempBox);
    }
}

var runBtn=document.getElementById("runBtn");
runBtn.onclick=function ()
{
    for(var i=0;i<rows;i++)
    {
        for(var j=0;j<cols;j++)
        {
            if(grid[i][j]==0)document.getElementById(i+" "+j).style.backgroundColor="rgb(200,200,200)";
        }
    }
    switch(document.querySelector("#algoSelect").value)
    {
        case "0":BFS();break;
        case "1":break;
        case "2":break;
        case "3":break;
    }
}

// QUEUE
class Queue{
    constructor()
    {
        this.items=[];
    }
    enqueue(item)
    {
        this.items.push(item);
    }
    dequeue()
    {
        return this.items.shift();
    }
    isEmpty()
    {
        return this.items.length==0;
    }
    front()
    {
        return this.items[0];
    }
    size()
    {
        return this.items.length;
    }
}
// QUEUE
function Update(element,color)
{
    element.style.backgroundColor=color;
}
function BFS()
{
    var delay=0;
    var found=false;
    var path=new Array(rows);
    for(var i=0;i<rows;i++)
    {
        path[i]=new Array(cols);
        for(var j=0;j<cols;j++)path[i][j]=-1;
    }

    var directions=[[-1,0],[0,1],[1,0],[0,-1]];

    var q=new Queue();
    q.enqueue([source.r,source.c]);
    path[source.r][source.c]=0;

    while(!q.isEmpty())
    {
        var size=q.size();
        var newNodeInserted=false;
        while(size--)
        {
            var temp=q.front();
            setTimeout(Update,delay,document.getElementById(temp[0]+" "+temp[1]),"rgb(0,0,255)");
            setTimeout(Update,delay+100,document.getElementById(temp[0]+" "+temp[1]),"rgb(255,0,0)");
            q.dequeue();
            for(var d=0;d<4;d++)
            {
                var tx=temp[0]+directions[d][0],ty=temp[1]+directions[d][1];
                if(tx>=0 && ty>=0 && tx<rows && ty<cols && path[tx][ty]==-1 && grid[tx][ty]==0)
                {
                    path[tx][ty]=temp;
                    newNodeInserted=true;
                    q.enqueue([tx,ty]);
                    if(tx==destination.r && ty==destination.c)
                    {
                        found = true;
                    }
                }
            }
        }
        if(!newNodeInserted)
        {
            setTimeout(function () { console.log("NO VALID PATH EXIST"); },delay);
            break;
        }
        delay+=100;
        if(found)break;
        
    }
    if(found)
    {
        var i=destination.r,j=destination.c;
        while(i!=source.r || j!=source.c)
        {
            setTimeout(Update,delay,document.getElementById(i+" "+j),"rgb(0,255,0)");
            [i,j]=path[i][j];
        }
        setTimeout(Update,delay,document.getElementById(source.r+" "+source.c),"rgb(0,255,0)");
    }
}

