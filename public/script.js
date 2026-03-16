let totalPortfolioValue = 0;
let totalBuyAmount = 0;
let totalSellAmount = 0;
let netCashAmount = 0;

async function loadData(){

try {
const funds = await fetch("/model-funds").then(res=>res.json());
const holdings = await fetch("/holdings").then(res=>res.json());

let totalPortfolio = 0;

holdings.forEach(h=>{
    totalPortfolio += h.current_value;
});

document.getElementById("portfolioValue").innerText =
"₹"+totalPortfolio.toLocaleString();


const table = document.querySelector("#table tbody");

let totalBuy = 0;
let totalSell = 0;


funds.forEach(f=>{

let holding = holdings.find(h=>h.fund_id === f.fund_id);

let currentValue = holding ? holding.current_value : 0;

let currentPct = (currentValue / totalPortfolio) * 100;

let targetPct = f.allocation_pct;

let drift = targetPct - currentPct;

let amount = (drift/100)*totalPortfolio;

let action = "";
let className = "";

if(amount > 0){

action = "BUY";
className = "buy";
totalBuy += amount;

}
else{

action = "SELL";
className = "sell";
totalSell += Math.abs(amount);

}

table.innerHTML += `
<tr>
<td>${f.fund_name}</td>
<td>${targetPct}%</td>
<td>${currentPct.toFixed(1)}%</td>
<td>${drift.toFixed(1)}%</td>
<td class="${className}">${action}</td>
<td>₹${Math.abs(amount).toFixed(0)}</td>
</tr>
`;

});


document.getElementById("totalBuy").innerText =
"₹"+Math.round(totalBuy).toLocaleString();

document.getElementById("totalSell").innerText =
"₹"+Math.round(totalSell).toLocaleString();

document.getElementById("netCash").innerText =
"₹"+Math.round(totalBuy-totalSell).toLocaleString();

totalPortfolioValue = totalPortfolio;
totalBuyAmount = totalBuy;
totalSellAmount = totalSell;
netCashAmount = totalBuy - totalSell;

} catch (error) {
console.error("Error loading data:", error);
}

}

loadData();


async function saveData(){

try {
await fetch("/save",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({
portfolio_value: Math.round(totalPortfolioValue),
total_buy: Math.round(totalBuyAmount),
total_sell: Math.round(totalSellAmount),
net_cash: Math.round(netCashAmount)
})

})

alert("Recommendation saved successfully!");

} catch (error) {
console.error("Error saving data:", error);
alert("Failed to save recommendation.");
}

}