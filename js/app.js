// ============================================
// SUN MEDIA - Stationery Request App
// In-Memory Storage (No LocalStorage)
// ============================================

// ============================================
// IN-MEMORY DATA STORE
// ============================================

const AppData = {
    // Default stationery items (from the image)
    items: [
        { id: 1, name: "Ball Point Pen - Blue", image: "https://via.placeholder.com/150/3498db/ffffff?text=Blue+Pen" },
        { id: 2, name: "Ball Point Pen - Black", image: "https://via.placeholder.com/150/2c3e50/ffffff?text=Black+Pen" },
        { id: 3, name: "Ball Point Pen - Red", image: "https://via.placeholder.com/150/e74c3c/ffffff?text=Red+Pen" },
        { id: 4, name: "Marker Pen - Blue", image: "https://via.placeholder.com/150/3498db/ffffff?text=Blue+Marker" },
        { id: 5, name: "Marker Pen - Black", image: "https://via.placeholder.com/150/2c3e50/ffffff?text=Black+Marker" },
        { id: 6, name: "Marker Pen - Red", image: "https://via.placeholder.com/150/e74c3c/ffffff?text=Red+Marker" },
        { id: 7, name: "Pencil", image: "https://via.placeholder.com/150/f39c12/ffffff?text=Pencil" },
        { id: 8, name: "Eraser", image: "https://via.placeholder.com/150/ecf0f1/2c3e50?text=Eraser" },
        { id: 9, name: "Arch File 3\"", image: "https://via.placeholder.com/150/9b59b6/ffffff?text=Arch+File+3" },
        { id: 10, name: "Arch File 2\"", image: "https://via.placeholder.com/150/9b59b6/ffffff?text=Arch+File+2" },
        { id: 11, name: "Stapler", image: "https://via.placeholder.com/150/1abc9c/ffffff?text=Stapler" },
        { id: 12, name: "Bullets for Stapler (Box)", image: "https://via.placeholder.com/150/16a085/ffffff?text=Stapler+Bullets" },
        { id: 13, name: "Long Ruler", image: "https://via.placeholder.com/150/3498db/ffffff?text=Long+Ruler" },
        { id: 14, name: "Hole Puncher", image: "https://via.placeholder.com/150/34495e/ffffff?text=Hole+Puncher" },
        { id: 15, name: "Paper Clips - Small (Box)", image: "https://via.placeholder.com/150/95a5a6/ffffff?text=Small+Clips" },
        { id: 16, name: "Paper Clips - Jumbo (Box)", image: "https://via.placeholder.com/150/7f8c8d/ffffff?text=Jumbo+Clips" }
    ],
    
    // Submissions storage
    submissions: [],
    
    // Admin session
    adminAuth: false,
    
    // Current request (temporary, during form flow)
    currentRequest: null
};

// ============================================
// ITEMS MANAGEMENT
// ============================================

function getItems() {
    return AppData.items;
}

function getNextId() {
    const items = getItems();
    return items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
}

// ============================================
// REQUEST FORM - Load Items
// ============================================

function loadItemsForRequest() {
    const container = document.getElementById('itemsContainer');
    if (!container) return;
    
    const items = getItems();
    container.innerHTML = '';
    
    if (items.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1/-1;">
                <i class="fas fa-box-open"></i>
                <p>No items available. Please contact admin.</p>
            </div>
        `;
        return;
    }
    
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.dataset.id = item.id;
        card.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image" onerror="this.src='https://via.placeholder.com/150?text=No+Image'">
            <div class="item-name">${item.name}</div>
            <button class="select-btn" onclick="toggleItem(${item.id})">
                <i class="fas fa-plus"></i> Select
            </button>
            <div class="item-controls">
                <label>Quantity <span class="required">*</span></label>
                <input type="number" id="qty-${item.id}" min="1" placeholder="Enter quantity" onchange="validateItem(${item.id})">
                <label>Purpose <span class="required">*</span></label>
                <textarea id="purpose-${item.id}" placeholder="Enter purpose of request" onchange="validateItem(${item.id})"></textarea>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleItem(id) {
    const card = document.querySelector(`.item-card[data-id="${id}"]`);
    if (!card) return;
    
    const btn = card.querySelector('.select-btn');
    
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        btn.innerHTML = '<i class="fas fa-plus"></i> Select';
        const qtyInput = document.getElementById(`qty-${id}`);
        const purposeInput = document.getElementById(`purpose-${id}`);
        if (qtyInput) qtyInput.value = '';
        if (purposeInput) purposeInput.value = '';
    } else {
        card.classList.add('selected');
        btn.innerHTML = '<i class="fas fa-minus"></i> Remove';
    }
}

function validateItem(id) {
    const qty = document.getElementById(`qty-${id}`)?.value;
    const purpose = document.getElementById(`purpose-${id}`)?.value;
    const card = document.querySelector(`.item-card[data-id="${id}"]`);
    
    if (card && qty && purpose) {
        card.style.borderColor = 'var(--success)';
    }
}

// ============================================
// REVIEW PAGE
// ============================================

function goToReview() {
    // Validate basic info
    const name = document.getElementById('reqName')?.value;
    const division = document.getElementById('reqDivision')?.value;
    const dept = document.getElementById('reqDept')?.value;
    const date = document.getElementById('reqDate')?.value;
    const reqBy = document.getElementById('reqBy')?.value;
    
    if (!name || !division || !dept || !date || !reqBy) {
        alert('Please fill in all basic information fields!');
        return;
    }
    
    // Get selected items
    const selectedCards = document.querySelectorAll('.item-card.selected');
    if (selectedCards.length === 0) {
        alert('Please select at least one item!');
        return;
    }
    
    const selectedItems = [];
    let hasError = false;
    
    selectedCards.forEach(card => {
        const id = parseInt(card.dataset.id);
        const qtyInput = document.getElementById(`qty-${id}`);
        const purposeInput = document.getElementById(`purpose-${id}`);
        const qty = qtyInput ? qtyInput.value : '';
        const purpose = purposeInput ? purposeInput.value : '';
        
        if (!qty || !purpose) {
            alert('Quantity and Purpose are required for all selected items!');
            hasError = true;
            return;
        }
        
        const item = getItems().find(i => i.id === id);
        if (item) {
            selectedItems.push({
                id: id,
                name: item.name,
                image: item.image,
                quantity: qty,
                purpose: purpose
            });
        }
    });
    
    if (hasError) return;
    
    // Save to memory
    AppData.currentRequest = {
        basicInfo: { name, division, dept, date, reqBy },
        items: selectedItems,
        timestamp: new Date().toISOString()
    };
    
    window.location.href = 'review.html';
}

function displayReview() {
    const data = AppData.currentRequest;
    if (!data) {
        window.location.href = 'request.html';
        return;
    }
    
    // Display basic info
    const infoContainer = document.getElementById('reviewBasicInfo');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <div class="info-item">
                <label>Name</label>
                <span>${escapeHtml(data.basicInfo.name)}</span>
            </div>
            <div class="info-item">
                <label>Division</label>
                <span>${escapeHtml(data.basicInfo.division)}</span>
            </div>
            <div class="info-item">
                <label>Department</label>
                <span>${escapeHtml(data.basicInfo.dept)}</span>
            </div>
            <div class="info-item">
                <label>Date</label>
                <span>${data.basicInfo.date}</span>
            </div>
            <div class="info-item">
                <label>Requested By</label>
                <span>${escapeHtml(data.basicInfo.reqBy)}</span>
            </div>
        `;
    }
    
    // Display items
    const itemsContainer = document.getElementById('reviewItems');
    if (itemsContainer) {
        itemsContainer.innerHTML = '';
        
        data.items.forEach(item => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <img src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
                <div class="item-details">
                    <h5>${escapeHtml(item.name)}</h5>
                    <p class="item-purpose"><i class="fas fa-comment"></i> ${escapeHtml(item.purpose)}</p>
                </div>
                <div class="item-qty">x${escapeHtml(item.quantity)}</div>
            `;
            itemsContainer.appendChild(div);
        });
    }
}

function submitRequest() {
    const data = AppData.currentRequest;
    if (!data) return;
    
    // Save to submissions
    const submission = {
        ...data,
        id: Date.now(),
        status: 'Pending'
    };
    
    AppData.submissions.push(submission);
    
    // Clear current request
    AppData.currentRequest = null;
    
    // Show success modal
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.add('active');
    }
}

// ============================================
// ADMIN AUTHENTICATION
// ============================================

function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername')?.value;
    const password = document.getElementById('adminPassword')?.value;
    
    // Simple authentication
    if (username === 'admin' && password === 'admin123') {
        AppData.adminAuth = true;
        window.location.href = 'admin-panel.html';
    } else {
        alert('Invalid username or password!');
    }
    return false;
}

function checkAdminAuth() {
    if (!AppData.adminAuth) {
        window.location.href = 'admin-login.html';
    }
}

function adminLogout() {
    AppData.adminAuth = false;
    window.location.href = 'admin-login.html';
}

// ============================================
// ADMIN PANEL - ITEMS MANAGEMENT
// ============================================

function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    if (section === 'items') {
        const itemsSection = document.getElementById('itemsSection');
        if (itemsSection) itemsSection.classList.add('active');
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) sectionTitle.innerHTML = '<i class="fas fa-boxes"></i> Manage Stationery Items';
    } else {
        const submissionsSection = document.getElementById('submissionsSection');
        if (submissionsSection) submissionsSection.classList.add('active');
        const sectionTitle = document.getElementById('sectionTitle');
        if (sectionTitle) sectionTitle.innerHTML = '<i class="fas fa-clipboard-list"></i> Submissions';
    }
    
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

function loadAdminItems() {
    const tbody = document.getElementById('itemsTableBody');
    if (!tbody) return;
    
    const items = getItems();
    tbody.innerHTML = '';
    
    if (items.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;padding:40px;color:var(--gray);">
                    <i class="fas fa-box-open" style="font-size:2rem;display:block;margin-bottom:10px;"></i>
                    No items available. Add your first item!
                </td>
            </tr>
        `;
        return;
    }
    
    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td><img src="${item.image}" class="item-thumb" alt="${escapeHtml(item.name)}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'"></td>
            <td>${escapeHtml(item.name)}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-edit" onclick="editItem(${item.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteItem(${item.id})">
                        <i class="fas fa-trash"></i> Remove
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

let editingItemId = null;

function openItemModal(itemId = null) {
    editingItemId = itemId;
    const modal = document.getElementById('itemModal');
    const title = document.getElementById('modalTitle');
    const nameInput = document.getElementById('itemName');
    const urlInput = document.getElementById('itemImageUrl');
    const preview = document.getElementById('imagePreview');
    
    if (!modal) return;
    
    if (itemId) {
        const item = getItems().find(i => i.id === itemId);
        if (item && title && nameInput && urlInput) {
            title.innerHTML = '<i class="fas fa-edit"></i> Edit Item';
            nameInput.value = item.name;
            urlInput.value = item.image;
            if (preview) {
                preview.innerHTML = `<img src="${item.image}" style="max-width:100%;max-height:200px;border-radius:8px;" onerror="this.src='https://via.placeholder.com/200?text=Invalid+URL'"><p>Image Preview</p>`;
                preview.classList.add('has-image');
            }
        }
    } else {
        if (title) title.innerHTML = '<i class="fas fa-plus"></i> Add New Item';
        if (nameInput) nameInput.value = '';
        if (urlInput) urlInput.value = '';
        if (preview) {
            preview.innerHTML = '<i class="fas fa-image"></i><p>Enter image URL to see preview</p>';
            preview.classList.remove('has-image');
        }
    }
    
    modal.classList.add('active');
    
    // Add live preview listener
    if (urlInput) {
        urlInput.oninput = function() {
            const url = this.value;
            if (preview) {
                if (url) {
                    preview.innerHTML = `<img src="${url}" style="max-width:100%;max-height:200px;border-radius:8px;" onerror="this.src='https://via.placeholder.com/200?text=Invalid+URL'"><p>Image Preview</p>`;
                    preview.classList.add('has-image');
                } else {
                    preview.innerHTML = '<i class="fas fa-image"></i><p>Enter image URL to see preview</p>';
                    preview.classList.remove('has-image');
                }
            }
        };
    }
}

function closeItemModal() {
    const modal = document.getElementById('itemModal');
    if (modal) modal.classList.remove('active');
    
    const form = document.getElementById('itemForm');
    if (form) form.reset();
    
    editingItemId = null;
}

function saveItem(e) {
    e.preventDefault();
    
    const nameInput = document.getElementById('itemName');
    const urlInput = document.getElementById('itemImageUrl');
    
    if (!nameInput || !urlInput) return false;
    
    const name = nameInput.value.trim();
    const image = urlInput.value.trim() || 'https://via.placeholder.com/150?text=No+Image';
    
    if (!name) {
        alert('Item name is required!');
        return false;
    }
    
    if (editingItemId) {
        const index = AppData.items.findIndex(i => i.id === editingItemId);
        if (index !== -1) {
            AppData.items[index] = { id: editingItemId, name, image };
        }
    } else {
        AppData.items.push({ id: getNextId(), name, image });
    }
    
    loadAdminItems();
    closeItemModal();
    
    return false;
}

function editItem(id) {
    openItemModal(id);
}

function deleteItem(id) {
    if (confirm('Are you sure you want to remove this item?')) {
        AppData.items = AppData.items.filter(i => i.id !== id);
        loadAdminItems();
    }
}

// ============================================
// ADMIN PANEL - SUBMISSIONS
// ============================================

function loadSubmissions() {
    const container = document.getElementById('submissionsList');
    if (!container) return;
    
    const submissions = AppData.submissions;
    
    if (submissions.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-clipboard-list"></i>
                <h3>No Submissions Yet</h3>
                <p>Submitted requests will appear here.</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    [...submissions].reverse().forEach(sub => {
        const card = document.createElement('div');
        card.className = 'submission-card';
        card.innerHTML = `
            <div class="submission-info">
                <h4><i class="fas fa-file-alt"></i> Request from ${escapeHtml(sub.basicInfo.name)}</h4>
                <div class="submission-meta">
                    <span><i class="fas fa-building"></i> ${escapeHtml(sub.basicInfo.division)}</span>
                    <span><i class="fas fa-calendar"></i> ${sub.basicInfo.date}</span>
                    <span><i class="fas fa-box"></i> ${sub.items.length} items</span>
                    <span><i class="fas fa-clock"></i> ${new Date(sub.timestamp).toLocaleString()}</span>
                </div>
            </div>
            <div class="submission-actions">
                <button class="btn-view" onclick="viewSubmission(${sub.id})">
                    <i class="fas fa-eye"></i> View
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

let currentSubmissionId = null;

function viewSubmission(id) {
    currentSubmissionId = id;
    const sub = AppData.submissions.find(s => s.id === id);
    
    if (!sub) return;
    
    const details = document.getElementById('submissionDetails');
    if (!details) return;
    
    details.innerHTML = `
        <div class="info-display">
            <div class="info-item">
                <label>Name</label>
                <span>${escapeHtml(sub.basicInfo.name)}</span>
            </div>
            <div class="info-item">
                <label>Division</label>
                <span>${escapeHtml(sub.basicInfo.division)}</span>
            </div>
            <div class="info-item">
                <label>Department</label>
                <span>${escapeHtml(sub.basicInfo.dept)}</span>
            </div>
            <div class="info-item">
                <label>Date</label>
                <span>${sub.basicInfo.date}</span>
            </div>
            <div class="info-item">
                <label>Requested By</label>
                <span>${escapeHtml(sub.basicInfo.reqBy)}</span>
            </div>
            <div class="info-item">
                <label>Submitted</label>
                <span>${new Date(sub.timestamp).toLocaleString()}</span>
            </div>
        </div>
        <h4 style="margin:20px 0 15px;color:var(--primary);"><i class="fas fa-list"></i> Requested Items</h4>
        <div class="items-display">
            ${sub.items.map(item => `
                <div class="review-item">
                    <img src="${item.image}" alt="${escapeHtml(item.name)}" onerror="this.src='https://via.placeholder.com/50?text=No+Image'">
                    <div class="item-details">
                        <h5>${escapeHtml(item.name)}</h5>
                        <p class="item-purpose"><i class="fas fa-comment"></i> ${escapeHtml(item.purpose)}</p>
                    </div>
                    <div class="item-qty">x${escapeHtml(item.quantity)}</div>
                </div>
            `).join('')}
        </div>
        <div class="approval-section" style="margin-top:30px;">
            <div class="signature-box">
                <p><strong>Approved By HOD</strong></p>
                <div class="signature-line">____________________</div>
                <p>Date: _______________</p>
            </div>
            <div class="signature-box">
                <p><strong>Received By</strong></p>
                <div class="signature-line">____________________</div>
                <p>Date: _______________</p>
            </div>
        </div>
        <div class="collection-note" style="margin-top:20px;">
            <i class="fas fa-clock"></i>
            <strong>Stationery Collection:</strong> From 10:00 AM till 4:00 PM (exception for urgent request)
        </div>
    `;
    
    const modal = document.getElementById('submissionModal');
    if (modal) modal.classList.add('active');
}

function closeSubmissionModal() {
    const modal = document.getElementById('submissionModal');
    if (modal) modal.classList.remove('active');
    currentSubmissionId = null;
}

function printSubmission() {
    window.print();
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Any global initialization can go here
});
