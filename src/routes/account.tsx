<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GrowDesk - Team Training & Admin Portal</title>
    <style>
        :root {
            --primary: #2563eb;
            --primary-hover: #1d4ed8;
            --bg: #f8fafc;
            --card-bg: #ffffff;
            --text: #1e293b;
            --border: #e2e8f0;
            --accent: #10b981;
            --warning: #f59e0b;
        }
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: var(--bg); color: var(--text); margin: 0; padding: 0; }
        .container { max-width: 1000px; margin: 40px auto; background: var(--card-bg); padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
        h1, h2, h3 { color: var(--primary); }
        h4 { margin-bottom: 5px; color: #334155; font-size: 18px; border-bottom: 2px solid var(--border); padding-bottom: 5px; }
        input { width: 100%; padding: 12px; margin: 10px 0 20px 0; border: 1px solid var(--border); border-radius: 6px; box-sizing: border-box; }
        button { background-color: var(--primary); color: white; border: none; padding: 12px 20px; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; width: 100%; margin-bottom: 10px; }
        button:hover { background-color: var(--primary-hover); }
        .hidden { display: none !important; }
        .card { background: #f1f5f9; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid var(--primary); }
        .pricing-box { background: #fffbeb; padding: 15px; border-radius: 6px; border: 1px solid #fde68a; margin-bottom: 15px; }
        .script-box { background: #e2e8f0; padding: 15px; border-radius: 6px; font-style: italic; margin: 10px 0; border-left: 4px solid var(--accent); white-space: pre-line; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white; }
        th, td { border: 1px solid var(--border); padding: 10px; text-align: left; font-size: 14px; }
        th { background-color: #e0e7ff; color: var(--primary); }
        .logout-btn { background-color: #ef4444; width: auto; float: right; padding: 6px 12px; font-size: 14px; }
        .highlight { color: var(--accent); font-weight: bold; }
        .alert-text { color: #dc2626; font-weight: bold; font-size: 14px; }
        .test-link-btn { background-color: #10b981; font-size: 18px; padding: 15px; margin-top: 20px; }
        .test-link-btn:hover { background-color: #059669; }
    </style>
</head>
<body>

<div class="container">
    <!-- LOGIN SECTION -->
    <div id="login-section">
        <h1>GrowDesk Team Portal</h1>
        <p>Login to access training modules, pricing logic, and calling scripts.</p>
        <div class="card">
            <label>Full Name:</label>
            <input type="text" id="login-name" placeholder="Enter your full name">
            <label>Gmail ID:</label>
            <input type="email" id="login-email" placeholder="Enter your registered gmail">
            <button onclick="handleLogin()">Login / Start Training</button>
        </div>
    </div>

    <!-- USER PANEL (TRAINING & SCRIPTS) -->
    <div id="user-panel" class="hidden">
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
        <h2>Welcome, <span id="user-display-name"></span>!</h2>
        <p>Complete the 3 modules below. Once done, click the link at the bottom to start your certification test.</p>

        <!-- MODULE 1: CORE SERVICES -->
        <div class="card">
            <h3>📖 Module 1: What We Sell (Our 6 Core Services)</h3>
            <ul>
                <li><b>1. Custom Website Development:</b> Smart websites and landing pages for direct orders/bookings.</li>
                <li><b>2. Performance Ads (Meta/Google):</b> Targeted local ads to generate verified leads directly on WhatsApp.</li>
                <li><b>3. WhatsApp Automation Bot:</b> AI bots for instant replies, sending menus, and taking 24/7 orders.</li>
                <li><b>4. Custom Telecalling CRM:</b> Admin dashboards to track telecaller leads, voice notes, and agent performance.</li>
                <li><b>5. Web Scraping & B2B Data:</b> Extracting verified contact details (HRs, Clinics) for B2B outreach.</li>
                <li><b>6. Table-Top QR Ordering:</b> System for cafes where customers scan a QR on their table to order and pay.</li>
            </ul>
        </div>

        <!-- MODULE 2: PRICING LOGIC -->
        <div class="card">
            <h3>💰 Module 2: Pricing & Advance Payment Logic</h3>
            <p>You must explain <b>WHY</b> we charge advance so you can confidently close the deal.</p>

            <div class="pricing-box">
                <h4>1. Websites, CRM, and QR Ordering Systems (₹7,999 to ₹14,999)</h4>
                <p><b>Rule:</b> <span class="alert-text">Strictly 50% Advance.</span></p>
                <p><b>Explanation:</b> "Sir, to start your work, our agency has to instantly purchase your Domain Name (.com) and Cloud Servers. Since these are non-refundable raw materials, a 50% advance is required to register assets in your name."</p>
            </div>

            <div class="pricing-box">
                <h4>2. Performance Ads (₹9,999 to ₹14,999/mo Agency Fee)</h4>
                <p><b>Rule:</b> <span class="alert-text">100% Ad Budget Upfront + 50% Agency Fee Advance.</span></p>
                <p><b>Explanation:</b> "Sir, the Daily Ad Budget goes directly to Meta/Google wallets. We need the full month's ad budget upfront to load into your wallet, plus a 50% advance of our management fee to design your ads."</p>
            </div>

            <div class="pricing-box">
                <h4>3. WhatsApp Automation Bot (₹2,499 Setup + ₹500/Mo)</h4>
                <p><b>Rule:</b> Setup fee one-time. Monthly fee is prepaid for Meta API.</p>
                <p><b>Explanation:</b> "Sir, ₹2,499 is our setup charge. The ₹500/month is required because Meta charges per conversation. We manage your Meta wallet and server maintenance within this ₹500."</p>
            </div>
        </div>

        <!-- MODULE 3: CALLING SCRIPTS (UPDATED FLOW) -->
        <div class="card">
            <h3>📞 Module 3: Category-Wise Calling Scripts</h3>
            <p><b>Call Flow:</b> Introduction -> GrowDesk Services for them -> Business & Next Steps.</p>
            
            <h4>1. Restaurants & Cafes</h4>
            <div class="script-box">
                "Hello Sir/Ma'am, main GrowDesk se baat kar raha hu. Hum Restaurants aur Cafes ke liye tech solutions aur automation set karte hain. 
                
                Aapke cafe ke liye hum 3 main services provide karte hain: Pehla, Table-Top QR Ordering system jisse customer table se direct order aur pay kar sake. Doosra, aapki custom delivery website, aur teesra, WhatsApp Bot jo customer inquiries handle kare.
                
                Isse aapke waiters ka time bachega aur order me zero mistakes hongi. Sir, inke setups ke liye domain aur server lagta hai, toh hum basic advance lekar aaj hi development start kar sakte hain. Kya hum basic demo discuss karein?"
            </div>

            <h4>2. Caterers & Bulk Food</h4>
            <div class="script-box">
                "Hello Sir/Ma'am, main GrowDesk se baat kar raha hu. Hum Caterers aur Bulk Food businesses ke liye sales automation banate hain.
                
                Aapke business ke liye hum WhatsApp AI Bot aur Smart Order Webpage banate hain. Koi bhi order ke liye message karega, bot use turant PDF menu bhejega aur link dega jahan log KGs mein quantity select karke direct payment book kar lenge.
                
                Isse aapka manual quotation banane ka headache khatam ho jayega. Hum iska setup ₹7,999 (one-time) me karte hain jisme 50% advance se server aur domain register hota hai. Kya hum iska demo link share karein?"
            </div>

            <h4>3. Real Estate Brokers / Builders</h4>
            <div class="script-box">
                "Hello Sir, main GrowDesk se baat kar raha hu. Hum Real Estate companies ke liye lead generation aur calling systems banate hain.
                
                Aapki team ke liye hum 2 services dete hain: Pehla, Google/Meta Ads run karke verified property buyers ki leads lana. Doosra, aapki telecalling team ke liye Custom CRM dashboard jahan har lead ka status aur agent ke voice notes ek jagah track hote hain.
                
                Humara CRM aur Ads management ka setup hum advance model par karte hain jahan ad budget direct Meta wallet me load hota hai. Kya main CRM ka flow aapko samjha sakta hu?"
            </div>

            <h4>4. B2B Wholesalers & Manufacturers</h4>
            <div class="script-box">
                "Hello Sir, main GrowDesk se baat kar raha hu. Hum B2B businesses ke liye data aur outreach automation karte hain.
                
                Aapke business ke liye hum Web Scraping tool se aapki target audience (jaise HRs, Clinics, Retailers) ka verified contact data nikal kar dete hain. Sath hi WhatsApp Bot lagate hain jo in leads ko automatically aapka catalog bhej sake.
                
                Sir, data extraction aur bot setup dono domain aur servers par chalte hain, toh setup fee ka basic advance lekar hum aapka target data nikalna shuru kar sakte hain. Kis area ka data chahiye aapko?"
            </div>
        </div>

        <!-- TEST TRIGGER BUTTON -->
        <div id="test-trigger-section">
            <button class="test-link-btn" onclick="startTest()">Click Here to Start Your Certification Test 🚀</button>
        </div>

        <!-- TEST SECTION (HIDDEN INITIALLY) -->
        <div class="card hidden" id="test-card">
            <h3>📝 Final Assessment Test</h3>
            <p><strong>Q1: Why do we ask the client for a 50% advance on Websites and CRMs?</strong></p>
            <input type="radio" name="q1" value="wrong"> To pay telecaller salaries.<br>
            <input type="radio" name="q1" value="right"> Because we have to instantly purchase their Domain Name (.com) and Cloud Hosting Servers.<br>

            <p style="margin-top: 15px;"><strong>Q2: How does the payment for running Meta Ads work?</strong></p>
            <input type="radio" name="q2" value="right"> Client must pay the 1-month Ad Budget 100% in advance to load the wallet, plus 50% of our setup fee.<br>
            <input type="radio" name="q2" value="wrong"> We run the ads for free and client pays after 1 month.<br>

            <p style="margin-top: 15px;"><strong>Q3: What is the correct call flow when talking to a client?</strong></p>
            <input type="radio" name="q3" value="right"> Introduction -> List all GrowDesk services for them -> Discuss business & payment.<br>
            <input type="radio" name="q3" value="wrong"> Directly ask for money without explaining services.<br>

            <button style="margin-top: 20px;" onclick="submitTest()">Submit Test & Get Certified</button>
        </div>
        
        <div id="test-result" class="hidden card" style="background: #dcfce7; color: #166534; border-left-color: #166534;">
            <h3>🎉 Certified!</h3>
            <p>Your test is cleared. You are ready to start calling. The Admin has received your status.</p>
        </div>
    </div>

    <!-- ADMIN PANEL -->
    <div id="admin-panel" class="hidden">
        <button class="logout-btn" onclick="handleLogout()">Logout</button>
        <h2>👑 GrowDesk Admin Dashboard</h2>
        <p>Logged in as Admin: <b>sp5960701@gmail.com</b></p>

        <div class="card">
            <h3>Team Performance & Status</h3>
            <table>
                <thead>
                    <tr><th>Worker Name</th><th>Email</th><th>Training Status</th><th>Score</th></tr>
                </thead>
                <tbody id="admin-users-table"></tbody>
            </table>
        </div>
    </div>
</div>

<script>
    const ADMIN_EMAIL = "sp5960701@gmail.com";

    window.onload = function() {
        const savedUser = localStorage.getItem("growdesk_current_user");
        if (savedUser) routeUser(JSON.parse(savedUser));
    };

    function handleLogin() {
        const name = document.getElementById("login-name").value.trim();
        const email = document.getElementById("login-email").value.trim().toLowerCase();

        if (!name || !email) return alert("Please enter both Name and Gmail!");

        let users = JSON.parse(localStorage.getItem("growdesk_users") || "[]");
        let currentUser = users.find(u => u.email === email);
        
        if (!currentUser) {
            currentUser = { name, email, status: "Pending Training", score: "N/A" };
            users.push(currentUser);
            localStorage.setItem("growdesk_users", JSON.stringify(users));
        }

        localStorage.setItem("growdesk_current_user", JSON.stringify(currentUser));
        routeUser(currentUser);
    }

    function routeUser(user) {
        document.getElementById("login-section").classList.add("hidden");
        if (user.email === ADMIN_EMAIL) {
            document.getElementById("admin-panel").classList.remove("hidden");
            loadAdminData();
        } else {
            document.getElementById("user-panel").classList.remove("hidden");
            document.getElementById("user-display-name").innerText = user.name;
            if(user.status === "Certified ✅") {
                document.getElementById("test-trigger-section").classList.add("hidden");
                document.getElementById("test-card").classList.add("hidden");
                document.getElementById("test-result").classList.remove("hidden");
            }
        }
    }

    function startTest() {
        document.getElementById("test-trigger-section").classList.add("hidden");
        document.getElementById("test-card").classList.remove("hidden");
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    function submitTest() {
        const q1 = document.querySelector('input[name="q1"]:checked');
        const q2 = document.querySelector('input[name="q2"]:checked');
        const q3 = document.querySelector('input[name="q3"]:checked');

        if (!q1 || !q2 || !q3) return alert("Please answer all questions to complete certification.");

        let score = 0;
        if (q1.value === "right") score += 33.3;
        if (q2.value === "right") score += 33.3;
        if (q3.value === "right") score += 33.4;

        const currentUser = JSON.parse(localStorage.getItem("growdesk_current_user"));
        currentUser.status = "Certified ✅";
        currentUser.score = Math.round(score) + "%";

        let users = JSON.parse(localStorage.getItem("growdesk_users") || "[]");
        users = users.map(u => u.email === currentUser.email ? currentUser : u);
        
        localStorage.setItem("growdesk_users", JSON.stringify(users));
        localStorage.setItem("growdesk_current_user", JSON.stringify(currentUser));

        document.getElementById("test-card").classList.add("hidden");
        document.getElementById("test-result").classList.remove("hidden");
    }

    function loadAdminData() {
        const users = JSON.parse(localStorage.getItem("growdesk_users") || "[]");
        const tbody = document.getElementById("admin-users-table");
        tbody.innerHTML = "";

        users.forEach(u => {
            if(u.email !== ADMIN_EMAIL) {
                tbody.innerHTML += `<tr><td>${u.name}</td><td>${u.email}</td><td>${u.status}</td><td>${u.score}</td></tr>`;
            }
        });
    }

    function handleLogout() {
        localStorage.removeItem("growdesk_current_user");
        location.reload();
    }
</script>

</body>
</html>
