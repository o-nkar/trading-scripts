if( window.location.href == 'https://www.nseindia.com/market-data/live-equity-market' ){
  findStocks();
  document.getElementById('equitieStockSelect').addEventListener('change',findStocks);
  document.querySelector('.refreshIcon a').addEventListener('click',findStocks);
}
// nse code
function findStocks() {
  setTimeout(function(){
    let stockList	= document.querySelectorAll('#equityStockTable > tbody > tr');
    stockList.forEach(function(line, index){
      if(index<=0) return;
      line.querySelector('td:last-child').innerHTML='';
      let open	= line.querySelector('td:nth-child(2)').innerText;
      let high	= line.querySelector('td:nth-child(3)').innerText;
      let low		= line.querySelector('td:nth-child(4)').innerText;
      if(open === high)	line.style.backgroundColor = '#ff00004a';
      if(open === low)  line.style.backgroundColor = '#008e004a';
      let scriptName = line.querySelector('td:first-child a').href.split('?')[1];
      let link = document.createElement('a');
      link.href = 'https://www.tradingview.com/chart/?'+scriptName;
      link.target = '_blank';
      link.innerText = 'View on chart';
      line.querySelector("td:last-child").appendChild(link);
    });
  }, 1500);
}