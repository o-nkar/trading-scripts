setTimeout(function () {
  if( window.location.href == 'https://www.nseindia.com/market-data/live-equity-market' ){
    findStocks();
    document.getElementById('equitieStockSelect').addEventListener('change',findStocks);
    document.querySelector('.refreshIcon a').addEventListener('click',findStocks);
  }else{
    buildClockWrapper();
    // if sidebar listing present
    if(document.querySelector('.vddl-list.list-flat')){
      const trackList = document.querySelector('.vddl-list.list-flat');
      const config = { attributes: !1, childList: true, subtree: !1 };
      const callback = (mutationList, observer) => {
        for (const mutation of mutationList) {
          buildListItems();
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(trackList, config);
    }
    // order page
    if( window.location.pathname == '/orders'){
      buildBrokageWrapper();
    }
    document.querySelector('a[href="/orders"]')?.addEventListener('click', buildBrokageWrapper);
  }
}, 500);
function buildBrokageWrapper(){
  if(!document.getElementById('fo-Calc')){
    let foBrkDiv = document.createElement('div');
    foBrkDiv.id = 'fo-Calc';
    foBrkDiv.classList.add('fo-calc-wrapper');
    foBrkDiv.innerHTML = `
    <div class="cal-f">
      <h3 class="page-title small">Trades Summary</h3>
      <svg id="calc" xmlns="http://www.w3.org/2000/svg"><path d="M8.35 40v-3h6.5l-.75-.6q-3.2-2.55-4.65-5.55-1.45-3-1.45-6.7 0-5.3 3.125-9.525Q14.25 10.4 19.35 8.8v3.1q-3.75 1.45-6.05 4.825T11 24.15q0 3.15 1.175 5.475 1.175 2.325 3.175 4.025l1.5 1.05v-6.2h3V40Zm20.35-.75V36.1q3.8-1.45 6.05-4.825T37 23.85q0-2.4-1.175-4.875T32.75 14.6l-1.45-1.3v6.2h-3V8h11.5v3h-6.55l.75.7q3 2.8 4.5 6t1.5 6.15q0 5.3-3.1 9.55-3.1 4.25-8.2 5.85Z"/></svg>
    </div>
    <div id="calc-data"></div>`;
    document.querySelector('.orderbook')?.prepend(foBrkDiv);
    calculateFOBrokage();
    document.getElementById('calc')?.addEventListener('click', calculateFOBrokage);
  }
}
function LoadClock() {
  let date = new Date(),hh = date.getHours(),mm = date.getMinutes(),ss = date.getSeconds(),session = "AM";
  if(hh === 0)  hh = 12;
  if(hh > 12){
    hh = hh - 12;
    session = "PM";
  }
  hh = (hh < 10) ? "0" + hh : hh;
  mm = (mm < 10) ? "0" + mm : mm;
  ss = (ss < 10) ? "0" + ss : ss;
  let time = hh + ":" + mm + ":" + ss + " " + session;
  if(document.getElementById('cus-click')){
    document.getElementById("cus-click").innerText = time;
    let t = setTimeout(function(){ LoadClock() }, 1000);
  }
}
function buildClockWrapper(){
  setTimeout(function () {
    if(!document.getElementById('cus-click')){
      let Container = '.app-nav';
      if(location.pathname.split('/').includes('ext')){
        Container = '.chart-container';
      }
      if(document.querySelector(Container)){
        let navContainer = document.querySelector(Container);
        buildStockAnalystLink(navContainer),
        buildOptionChainLink(navContainer),
        buildNseLink(navContainer);
        // build clock wrapper
        let divClock = document.createElement('div');
        divClock.id = 'cus-click';
        navContainer.prepend(divClock);
        LoadClock();
      }
    }
    buildListItems();
  }, 1000);
}
function buildListItems(){
  if(document.querySelector('.vddl-list.list-flat')){
    document.querySelectorAll('.vddl-list.list-flat .vddl-draggable.instrument').forEach(item => {
      let niceName = item.querySelector('.nice-name').innerText;
      item.querySelector('.nice-name').innerText = niceName.replace('BANKNIFTY', 'BNF').replace('FINNIFTY', 'FNF');
    });
  }
}
function buildOptionChainLink(navContainer){
  let OptionChainLink = document.createElement('a');
  OptionChainLink.href = 'javascript:void(0);';
  OptionChainLink.classList.add('branded', 'svg', 'custom-options');
  OptionChainLink.innerHTML = `<img src="/static/images/addons/sensibull.svg" />`;
  navContainer.prepend(OptionChainLink);
  document.querySelector('a.custom-options').addEventListener('click', function(){
    let optionScript = '';
    if( window.location.pathname.split('/')[5] !== undefined){
      optionScript = window.location.pathname.split('/')[5];
    }else{
      optionScript = 'NIFTY%2050';
    }
    let iframeSrc = `https://insights.sensibull.com/widget/option-chain?instrument=${optionScript}&amp;theme=dark&amp;broker=1`;
    buildModel('option-chain-modal', iframeSrc);
  });
}
function buildStockAnalystLink(navContainer){
  let stockAnalyst = document.createElement('a');
  stockAnalyst.href = 'javascript:void(0);';
  stockAnalyst.classList.add('branded', 'svg', 'postion-analysis');
  stockAnalyst.innerHTML = `<img src="/static/images/addons/sensibull.svg" />Analyze`;
  navContainer.prepend(stockAnalyst);
  document.querySelector('a.postion-analysis').addEventListener('click', () => {
    let iframeSrc = `https://api.sensibull.com/v1/kite/widget_login?theme=dark&amp;source=positions_page&amp;user_id=ITB275&amp;redirect_to=/widget/builder/positions_page`;
    buildModel('stocks-analyze-widget-modal', iframeSrc);
  });
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
// menu link for NSE
function buildNseLink(navContainer){
  let NseLink = document.createElement('a');
  NseLink.href = 'https://www.nseindia.com/market-data/live-equity-market';
  NseLink.target = '_blank';
  NseLink.innerText = 'NSE';
  navContainer.prepend(NseLink);
}
// brokrage calculator
function calculateFOBrokage(){
  let successTrades = [...document.querySelectorAll('.completed-orders table tbody tr:not(.show-all-row)')];
  let tradeData = successTrades.map((trade) => {
    let item =  {
      symbol  : trade.querySelector('.instrument .tradingsymbol')?.innerText,
      tranType: trade.querySelector('.transaction-type span')?.innerText,
      price   : trade.querySelector('.average-price span')?.innerText.split('/')[0],
      product : trade.querySelector('.product')?.innerText,
      exchange: trade.querySelector('.instrument .exchange')?.innerText,
      quantity: trade.querySelector('.quantity')?.innerText.split('/')[0],
      status  : trade.querySelector('.order-status span')?.innerText,
    };
    if(item.status == 'COMPLETE' && item.exchange == 'NFO') return item;
  }).filter((item)=> typeof(item) != 'undefined');
  let totalBrokerage = 0.00;
  let finalPL = 0.00;
  tradeData.forEach((trade) => {
    let qty = trade.quantity;
    if (trade.tranType == 'BUY') {
      bp = parseFloat(parseFloat(trade.price).toFixed(2));
      sp = 0;
      brokerage = 20;
    }
    if (trade.tranType == 'SELL') {
      sp = parseFloat(parseFloat(trade.price).toFixed(2));
      bp = 0;
      brokerage = 20;
    }
    let turnover      = parseFloat(parseFloat((bp + sp) * qty).toFixed(2));
    let stt_total     = Math.round(parseFloat(parseFloat(sp * qty * 0.0005).toFixed(2)));
    let etc           = parseFloat(parseFloat(0.00053*turnover).toFixed(2));
    let stax          = parseFloat(parseFloat(0.18 * (brokerage + etc)).toFixed(2));
    let sebi_charges  = parseFloat(parseFloat(turnover*0.000001).toFixed(2));
        sebi_charges  = parseFloat(parseFloat(sebi_charges + (sebi_charges * 0.18)).toFixed(2));
    let stamp_charges = Math.round(parseFloat(parseFloat(bp*qty*0.00003).toFixed(2)));
    let total_tax     = parseFloat(parseFloat(brokerage + stt_total + etc + stax + sebi_charges + stamp_charges).toFixed(2));
    totalBrokerage += total_tax;
    let net_profit = parseFloat(parseFloat(((sp - bp) * qty) - total_tax).toFixed(2));
    finalPL += net_profit;
  });
  let content = `
    <div class="overall-view">
      <div class="ov-left">
        <span class="title">Net Charges</span>
        <span class="ov-text text-red">${parseFloat(parseFloat(totalBrokerage)).toFixed(2)}</span>
      </div>
      <div class="ov-right">
        <span class="title">Net P/L</span>
        <span class="ov-text text-${finalPL>0 ? 'green': 'red'}">${finalPL> 0 ? '+'+parseFloat(parseFloat(finalPL)).toFixed(2): '-' +parseFloat(parseFloat(finalPL)).toFixed(2)}</span>
      </div>
    </div>
  `;
  document.getElementById('calc-data').innerHTML = content;
}
// build models
function buildModel(cls, iframeSrc){
  let modelDiv = document.createElement('div');
  modelDiv.classList.add('modal-mask', cls);
  modelDiv.style.setProperty('z-index', '13');
  modelDiv.innerHTML = `<div class="modal-wrapper"><div class="modal-container layer-2"><div class="modal-header"></div><div class="modal-body"><div class="option-chain-body"><iframe src="${iframeSrc}"></iframe></div></div><div class="modal-footer"></div></div></div>`;
  document.body.appendChild(modelDiv);
  window.addEventListener('click', function(evt){
    if(document.querySelector('.'+cls) && evt.target.classList.contains('modal-wrapper')){
      document.querySelector('.'+cls).remove();
    }
  });
}
