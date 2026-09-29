const API_URL = 'http://localhost:5000/api/trades';

document.addEventListener('DOMContentLoaded', () => {
    if(document.getElementById('tradeDate')) {
        document.getElementById('tradeDate').valueAsDate = new Date();
    }
    fetchTrades();
});

async function getAuthToken() {
    const user = firebase.auth().currentUser;
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

async function fetchTrades() {
    const token = await getAuthToken();
    if (!token) return;

    try {
        const response = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const trades = await response.json();
        renderTrades(trades);
    } catch (err) {
        console.error('Error fetching trades:', err);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const token = await getAuthToken();
    if (!token) return;

    const newTrade = {
        date: document.getElementById('tradeDate').value,
        instrument: document.getElementById('tradeInstrument').value.toUpperCase(),
        type: document.getElementById('tradeType').value,
        amount: parseFloat(document.getElementById('tradeAmount').value)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newTrade)
        });

        if (response.ok) {
            document.getElementById('addTradeForm').reset();
            document.getElementById('tradeDate').valueAsDate = new Date();
            fetchTrades(); // Refresh list
        }
    } catch (err) {
        console.error('Error adding trade:', err);
    }
}

function renderTrades(trades) {
    const container = document.getElementById('tradesListContainer');
    container.innerHTML = '';

    if (trades.length === 0) {
        container.innerHTML = `<p style="font-size: 12px; color: #64748b; text-align: center;">No trades found.</p>`;
        document.getElementById('totalPnlVal').innerText = "₹0";
        return;
    }

    let totalPnl = 0;
    trades.forEach(trade => {
        totalPnl += trade.amount;
        const isProfit = trade.amount >= 0;
        
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e293b; font-size: 13px;">
                <div>
                    <strong>${trade.instrument}</strong> <span style="font-size:10px; color:#94a3b8;">(${trade.type})</span>
                    <div style="font-size: 10px; color: #64748b;">${trade.date}</div>
                </div>
                <div class="${isProfit ? 'text-emerald' : 'text-rose'} font-bold">
                    ${isProfit ? '+' : ''}₹${trade.amount}
                </div>
            </div>
        `;
    });

    const pnlEl = document.getElementById('totalPnlVal');
    pnlEl.innerText = (totalPnl >= 0 ? "+₹" : "-₹") + Math.abs(totalPnl);
    pnlEl.className = totalPnl >= 0 ? "text-emerald" : "text-rose";
}

function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
    document.getElementById('tab-' + tabId)?.classList.remove('hidden');

    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('nav-' + tabId)?.classList.add('active');
}
