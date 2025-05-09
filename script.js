// داده های نمونه
let accounts = [
    {
        id: 1,
        name: "اکانت VIP فصل 2",
        price: 450000,
        level: 345,
        skins: 87,
        image: "account1.jpg",
        sold: false
    },
    {
        id: 2,
        name: "اکانت لگندری فصل 3",
        price: 620000,
        level: 421,
        skins: 112,
        image: "account2.jpg",
        sold: false
    },
    {
        id: 3,
        name: "اکانت ویژه فصل 5",
        price: 380000,
        level: 287,
        skins: 65,
        image: "account3.jpg",
        sold: true
    }
];

// متغیرهای حالت
let isAdmin = false;
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "bankai123";

// وقتی DOM لود شد
document.addEventListener('DOMContentLoaded', function() {
    // لود اکانت ها
    loadAccounts();
    
    // مدیریت رویدادهای فرم ورود
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            isAdmin = true;
            document.getElementById('adminPanelBtn').style.display = 'block';
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('adminPanel').style.display = 'block';
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            showToast('با موفقیت وارد شدید', 'success');
        } else {
            showToast('نام کاربری یا رمز عبور اشتباه است', 'danger');
        }
    });
    
    // مدیریت رویداد دکمه پنل مدیریت
    document.getElementById('adminPanelBtn').addEventListener('click', function() {
        document.getElementById('adminPanel').style.display = 'block';
        window.scrollTo({
            top: document.getElementById('adminPanel').offsetTop,
            behavior: 'smooth'
        });
    });
    
    // مدیریت رویداد دکمه ورود
    document.getElementById('loginBtn').addEventListener('click', function() {
        const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
        loginModal.show();
    });
    
    // مدیریت فرم افزودن اکانت جدید
    document.getElementById('addAccountForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const newAccount = {
            id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
            name: document.getElementById('accountName').value,
            price: parseInt(document.getElementById('accountPrice').value),
            level: parseInt(document.getElementById('accountLevel').value),
            skins: parseInt(document.getElementById('accountSkins').value),
            image: document.getElementById('accountImage').value,
            sold: false
        };
        
        accounts.push(newAccount);
        loadAccounts();
        loadAdminAccounts();
        document.getElementById('addAccountForm').reset();
        showToast('اکانت با موفقیت اضافه شد', 'success');
    });
});

// تابع لود اکانت ها در صفحه اصلی
function loadAccounts() {
    const container = document.getElementById('accountsContainer');
    container.innerHTML = '';
    
    accounts.forEach(account => {
        const card = document.createElement('div');
        card.className = 'col-md-4';
        card.innerHTML = `
            <div class="card account-card ${account.sold ? 'sold-account' : ''}">
                <img src="${account.image}" class="card-img-top" alt="${account.name}">
                <div class="card-body">
                    <h5 class="card-title">${account.name}</h5>
                    <p class="card-text">
                        <i class="bi bi-star-fill text-warning"></i> سطح: ${account.level}<br>
                        <i class="bi bi-person-bounding-box"></i> تعداد اسکین: ${account.skins}<br>
                        <i class="bi bi-coin"></i> قیمت: ${account.price.toLocaleString()} تومان
                    </p>
                    ${account.sold ? 
                        '<button class="btn btn-secondary w-100" disabled>فروخته شد</button>' : 
                        '<button class="btn btn-danger btn-buy w-100" onclick="buyAccount(' + account.id + ')">خرید اکانت</button>'
                    }
                    ${isAdmin ? `
                        <div class="mt-2 d-flex justify-content-between">
                            <button class="btn btn-sm btn-warning" onclick="editAccount(${account.id})">ویرایش</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteAccount(${account.id})">حذف</button>
                            <button class="btn btn-sm ${account.sold ? 'btn-success' : 'btn-outline-secondary'}" onclick="toggleSoldStatus(${account.id})">
                                ${account.sold ? 'موجود شد' : 'فروخته شد'}
                            </button>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// تابع لود اکانت ها در پنل مدیریت
function loadAdminAccounts() {
    const container = document.getElementById('adminAccountsList');
    container.innerHTML = '';
    
    accounts.forEach(account => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${account.name}</td>
            <td>${account.price.toLocaleString()} تومان</td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editAccount(${account.id})">ویرایش</button>
                <button class="btn btn-sm btn-danger me-1" onclick="deleteAccount(${account.id})">حذف</button>
                <button class="btn btn-sm ${account.sold ? 'btn-success' : 'btn-secondary'}" onclick="toggleSoldStatus(${account.id})">
                    ${account.sold ? 'موجود شد' : 'فروخته شد'}
                </button>
            </td>
        `;
        container.appendChild(row);
    });
}

// تابع خرید اکانت
function buyAccount(id) {
    const account = accounts.find(a => a.id === id);
    if (account && !account.sold) {
        if (confirm(`آیا از خرید اکانت "${account.name}" به قیمت ${account.price.toLocaleString()} تومان اطمینان دارید؟`)) {
            account.sold = true;
            loadAccounts();
            showToast('اکانت با موفقیت خریداری شد', 'success');
        }
    }
}

// تابع تغییر وضعیت فروخته شده/موجود
function toggleSoldStatus(id) {
    const account = accounts.find(a => a.id === id);
    if (account) {
        account.sold = !account.sold;
        loadAccounts();
        loadAdminAccounts();
        showToast(`وضعیت اکانت به ${account.sold ? 'فروخته شد' : 'موجود شد'} تغییر یافت`, 'info');
    }
}

// تابع ویرایش اکانت
function editAccount(id) {
    const account = accounts.find(a => a.id === id);
    if (account) {
        document.getElementById('accountName').value = account.name;
        document.getElementById('accountPrice').value = account.price;
        document.getElementById('accountLevel').value = account.level;
        document.getElementById('accountSkins').value = account.skins;
        document.getElementById('accountImage').value = account.image;
        
        // حذف اکانت قدیمی
        accounts = accounts.filter(a => a.id !== id);
        
        window.scrollTo({
            top: document.getElementById('addAccountForm').offsetTop,
            behavior: 'smooth'
        });
        
        showToast('اطلاعات اکانت برای ویرایش آماده شد', 'info');
    }
}

// تابع حذف اکانت
function deleteAccount(id) {
    if (confirm('آیا از حذف این اکانت اطمینان دارید؟')) {
        accounts = accounts.filter(a => a.id !== id);
        loadAccounts();
        loadAdminAccounts();
        showToast('اکانت با موفقیت حذف شد', 'warning');
    }
}

// تابع نمایش نوتیفیکیشن
function showToast(message, type) {
    const toastContainer = document.createElement('div');
    toastContainer.className = `toast align-items-center text-white bg-${type} border-0 position-fixed bottom-0 end-0 m-3`;
    toastContainer.setAttribute('role', 'alert');
    toastContainer.setAttribute('aria-live', 'assertive');
    toastContainer.setAttribute('aria-atomic', 'true');
    
    toastContainer.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    
    document.body.appendChild(toastContainer);
    const toast = new bootstrap.Toast(toastContainer);
    toast.show();
    
    toastContainer.addEventListener('hidden.bs.toast', function() {
        document.body.removeChild(toastContainer);
    });
}
