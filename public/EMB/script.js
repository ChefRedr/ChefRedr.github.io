// EMB Revenue Cycle Management Dashboard JavaScript

class Dashboard {
    constructor() {
        this.currentTab = 'overview';
        this.charts = {};
        this.sortableInstance = null;
        this.chatMessages = [
            {
                type: 'system',
                content: 'Welcome to EMB Support! How can we help you today?',
                time: '10:30 AM'
            }
        ];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeCharts();
        this.populateDataTables();
        this.populateClientFilter();
        this.populateClientsGrid();
        this.initializeDragAndDrop();
        this.setupChat();
        this.updateFinancialSummary();
        this.updateKeyMetrics();
        this.initializeCustomWidgetCharts();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Client management
        document.getElementById('addClientBtn').addEventListener('click', () => {
            this.openAddClientModal();
        });

        document.querySelector('.close').addEventListener('click', () => {
            this.closeAddClientModal();
        });

        document.getElementById('cancelAddClient').addEventListener('click', () => {
            this.closeAddClientModal();
        });

        document.getElementById('addClientForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewClient();
        });

        // Widget management
        document.getElementById('addWidgetBtn').addEventListener('click', () => {
            this.openAddWidgetModal();
        });

        document.getElementById('cancelAddWidget').addEventListener('click', () => {
            this.closeAddWidgetModal();
        });

        document.getElementById('addWidgetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewWidget();
        });

        document.getElementById('resetLayoutBtn').addEventListener('click', () => {
            this.resetDashboardLayout();
        });

        // Claim management
        document.getElementById('addClaimBtn').addEventListener('click', () => {
            this.openAddClaimModal();
        });

        document.getElementById('cancelAddClaim').addEventListener('click', () => {
            this.closeAddClaimModal();
        });

        document.getElementById('addClaimForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewClaim();
        });

        // Chat functionality
        document.getElementById('sendMessageBtn').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('chatInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Data filtering
        document.getElementById('clientFilter').addEventListener('change', () => {
            this.filterData();
        });

        document.getElementById('dateFilter').addEventListener('change', () => {
            this.filterData();
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('addClientModal');
            if (e.target === modal) {
                this.closeAddClientModal();
            }
        });

        // Widget dropdown menu functionality
        this.setupWidgetDropdowns();
    }

    switchTab(tabName) {
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Initialize charts for overview tab
        if (tabName === 'overview') {
            setTimeout(() => {
                this.initializeCharts();
            }, 100);
        }
    }

    initializeCustomWidgetCharts() {
        // Find all custom widget canvases and create placeholder charts
        document.querySelectorAll('canvas[id*="-"]').forEach(canvas => {
            const widgetId = canvas.id;
            if (!this.charts[widgetId]) {
                this.createPlaceholderChart(canvas, widgetId);
            }
        });
    }

    createPlaceholderChart(canvas, widgetId) {
        // Generate random dummy data based on widget type
        const widgetType = widgetId.split('-')[0];
        let chartData, chartType, chartOptions;

        switch(widgetType) {
            case 'patient-demographics':
                chartType = 'doughnut';
                chartData = {
                    labels: ['Adults (18-64)', 'Seniors (65+)', 'Pediatrics (0-17)', 'Geriatric (75+)'],
                    datasets: [{
                        data: [45, 25, 20, 10],
                        backgroundColor: [
                            'rgba(100, 181, 246, 0.8)',
                            'rgba(76, 175, 80, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(156, 39, 176, 0.8)'
                        ],
                        borderWidth: 2,
                        borderColor: '#0a223d'
                    }]
                };
                break;

            case 'insurance-breakdown':
                chartType = 'pie';
                chartData = {
                    labels: ['Commercial', 'Medicare', 'Medicaid', 'Self-Pay', 'Other'],
                    datasets: [{
                        data: [35, 30, 20, 10, 5],
                        backgroundColor: [
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(76, 175, 80, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(244, 67, 54, 0.8)',
                            'rgba(156, 39, 176, 0.8)'
                        ],
                        borderWidth: 2,
                        borderColor: '#0a223d'
                    }]
                };
                break;

            case 'monthly-comparison':
                chartType = 'bar';
                chartData = {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Current Year',
                        data: [120000, 135000, 118000, 142000, 158000, 165000],
                        backgroundColor: 'rgba(100, 181, 246, 0.8)',
                        borderColor: '#64b5f6',
                        borderWidth: 2
                    }, {
                        label: 'Previous Year',
                        data: [110000, 125000, 108000, 132000, 148000, 155000],
                        backgroundColor: 'rgba(156, 39, 176, 0.8)',
                        borderColor: '#9c27b0',
                        borderWidth: 2
                    }]
                };
                break;

            case 'denial-reasons':
                chartType = 'horizontalBar';
                chartData = {
                    labels: ['Prior Auth Required', 'Invalid CPT Code', 'Coverage Ended', 'Missing Documentation', 'Duplicate Claim'],
                    datasets: [{
                        data: [25, 18, 15, 12, 8],
                        backgroundColor: [
                            'rgba(244, 67, 54, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(156, 39, 176, 0.8)',
                            'rgba(33, 150, 243, 0.8)',
                            'rgba(76, 175, 80, 0.8)'
                        ],
                        borderWidth: 2,
                        borderColor: '#0a223d'
                    }]
                };
                break;

            case 'provider-performance':
                chartType = 'radar';
                chartData = {
                    labels: ['Clean Claims', 'Patient Satisfaction', 'Revenue per Visit', 'Collection Rate', 'Processing Speed'],
                    datasets: [{
                        label: 'Dr. Smith',
                        data: [95, 88, 92, 94, 87],
                        backgroundColor: 'rgba(100, 181, 246, 0.2)',
                        borderColor: '#64b5f6',
                        borderWidth: 2
                    }, {
                        label: 'Dr. Johnson',
                        data: [92, 91, 89, 96, 90],
                        backgroundColor: 'rgba(76, 175, 80, 0.2)',
                        borderColor: '#4caf50',
                        borderWidth: 2
                    }]
                };
                break;

            case 'payment-trends':
                chartType = 'line';
                chartData = {
                    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
                    datasets: [{
                        label: 'Payments Received',
                        data: [45000, 52000, 38000, 61000, 55000, 67000],
                        borderColor: '#64b5f6',
                        backgroundColor: 'rgba(100, 181, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                };
                break;

            default:
                // Generic placeholder chart
                chartType = 'bar';
                chartData = {
                    labels: ['Category A', 'Category B', 'Category C', 'Category D'],
                    datasets: [{
                        label: 'Custom Data',
                        data: [Math.floor(Math.random() * 100) + 20, Math.floor(Math.random() * 100) + 20, Math.floor(Math.random() * 100) + 20, Math.floor(Math.random() * 100) + 20],
                        backgroundColor: [
                            'rgba(100, 181, 246, 0.8)',
                            'rgba(76, 175, 80, 0.8)',
                            'rgba(255, 152, 0, 0.8)',
                            'rgba(156, 39, 176, 0.8)'
                        ],
                        borderWidth: 2,
                        borderColor: '#0a223d'
                    }]
                };
        }

        // Common chart options
        chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#ffffff'
                    }
                }
            },
            scales: chartType !== 'doughnut' && chartType !== 'pie' && chartType !== 'horizontalBar' ? {
                x: {
                    ticks: {
                        color: '#b0bec5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                },
                y: {
                    ticks: {
                        color: '#b0bec5'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            } : {}
        };

        // Create the chart
        this.charts[widgetId] = new Chart(canvas, {
            type: chartType,
            data: chartData,
            options: chartOptions
        });
    }

    initializeCharts() {
        // Revenue Chart
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx && !this.charts.revenue) {
            this.charts.revenue = new Chart(revenueCtx, {
                type: 'line',
                data: {
                    labels: sampleData.monthlyRevenue.map(item => item.month),
                    datasets: [{
                        label: 'Monthly Revenue ($)',
                        data: sampleData.monthlyRevenue.map(item => item.revenue),
                        borderColor: '#64b5f6',
                        backgroundColor: 'rgba(100, 181, 246, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#b0bec5'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#b0bec5',
                                callback: function(value) {
                                    return '$' + (value / 1000) + 'K';
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }

        // Claims Status Chart
        const claimsCtx = document.getElementById('claimsChart');
        if (claimsCtx && !this.charts.claims) {
            this.charts.claims = new Chart(claimsCtx, {
                type: 'doughnut',
                data: {
                    labels: sampleData.claimsStatus.map(item => item.status),
                    datasets: [{
                        data: sampleData.claimsStatus.map(item => item.count),
                        backgroundColor: [
                            'rgba(34, 139, 34, 0.8)',      // Dark green for Paid
                            'rgba(255, 140, 0, 0.8)',      // Dark orange for Pending
                            'rgba(178, 34, 34, 0.8)',      // Dark red for Denied
                            'rgba(25, 25, 112, 0.8)'       // Dark blue for Under Review
                        ],
                        borderWidth: 2,
                        borderColor: '#0a223d'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#ffffff',
                                padding: 20
                            }
                        }
                    }
                }
            });
        }

        // Client Performance Chart
        const clientCtx = document.getElementById('clientPerformanceChart');
        if (clientCtx && !this.charts.clientPerformance) {
            this.charts.clientPerformance = new Chart(clientCtx, {
                type: 'bar',
                data: {
                    labels: sampleData.clientPerformance.map(item => item.client.split(' ')[0]),
                    datasets: [{
                        label: 'Monthly Revenue ($)',
                        data: sampleData.clientPerformance.map(item => item.revenue),
                        backgroundColor: 'rgba(100, 181, 246, 0.8)',
                        borderColor: '#64b5f6',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#ffffff'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#b0bec5'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#b0bec5',
                                callback: function(value) {
                                    return '$' + (value / 1000) + 'K';
                                }
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        }
                    }
                }
            });
        }
    }

    populateDataTables() {
        this.populateClaimsTable();
        this.populatePatientsTable();
    }

    populateClaimsTable() {
        const tbody = document.getElementById('claimsTableBody');
        tbody.innerHTML = '';

        sampleData.claims.forEach(claim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${claim.id}</td>
                <td>${claim.clientName}</td>
                <td>${claim.patientName}</td>
                <td>${claim.procedure}</td>
                <td>$${claim.amount.toFixed(2)}</td>
                <td><span class="status-badge status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                <td>${new Date(claim.dateSubmitted).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    }

    populatePatientsTable() {
        const tbody = document.getElementById('patientsTableBody');
        tbody.innerHTML = '';

        sampleData.patients.forEach(patient => {
            const client = sampleData.clients.find(c => c.id === patient.clientId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${patient.id}</td>
                <td>${patient.name}</td>
                <td>${new Date(patient.dob).toLocaleDateString()}</td>
                <td>${patient.insurance}</td>
                <td>${patient.primaryCare}</td>
                <td>${new Date(patient.lastVisit).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    }

    populateClientFilter() {
        const filter = document.getElementById('clientFilter');
        filter.innerHTML = '<option value="all">All Clients</option>';
        
        sampleData.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            filter.appendChild(option);
        });
    }

    populateClientsGrid() {
        const grid = document.getElementById('clientsGrid');
        grid.innerHTML = '';

        sampleData.clients.forEach(client => {
            const clientCard = document.createElement('div');
            clientCard.className = 'client-card';
            
            // Calculate client stats
            const clientClaims = sampleData.claims.filter(claim => claim.clientId === client.id);
            const paidClaims = clientClaims.filter(claim => claim.status === 'Paid');
            const collectionRate = clientClaims.length > 0 ? (paidClaims.length / clientClaims.length * 100).toFixed(1) : 0;
            
            clientCard.innerHTML = `
                <h4>${client.name}</h4>
                <div class="client-info">
                    <span>📍 ${client.address}</span>
                    <span>📞 ${client.phone}</span>
                    <span>✉️ ${client.email}</span>
                    <span>👥 ${client.providers} Providers</span>
                </div>
                <div class="client-stats">
                    <div class="stat-item">
                        <div class="stat-value">$${(client.monthlyRevenue / 1000).toFixed(0)}K</div>
                        <div class="stat-label">Monthly Revenue</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${client.totalPatients}</div>
                        <div class="stat-label">Total Patients</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">${collectionRate}%</div>
                        <div class="stat-label">Collection Rate</div>
                    </div>
                </div>
                <div class="client-actions">
                    <button class="btn-primary btn-small">View Details</button>
                    <button class="btn-danger btn-small" onclick="dashboard.removeClient(${client.id})">Remove</button>
                </div>
            `;
            
            grid.appendChild(clientCard);
        });
    }

    filterData() {
        const clientFilter = document.getElementById('clientFilter').value;
        const dateFilter = document.getElementById('dateFilter').value;
        
        // Filter claims
        let filteredClaims = [...sampleData.claims];
        
        if (clientFilter !== 'all') {
            filteredClaims = filteredClaims.filter(claim => claim.clientId == clientFilter);
        }
        
        // Apply date filter logic (assuming we're currently in January 2024)
        switch(dateFilter) {
            case 'current':
                // Current month - January 2024
                filteredClaims = filteredClaims.filter(claim => {
                    const claimDate = new Date(claim.dateSubmitted);
                    return claimDate.getFullYear() === 2024 && claimDate.getMonth() === 0; // January
                });
                break;
            case 'last':
                // Last month - December 2023
                filteredClaims = filteredClaims.filter(claim => {
                    const claimDate = new Date(claim.dateSubmitted);
                    return claimDate.getFullYear() === 2023 && claimDate.getMonth() === 11; // December
                });
                break;
            case 'quarter':
                // This quarter - Q1 2024 (Jan, Feb, Mar)
                filteredClaims = filteredClaims.filter(claim => {
                    const claimDate = new Date(claim.dateSubmitted);
                    return claimDate.getFullYear() === 2024 && claimDate.getMonth() <= 2; // Jan, Feb, Mar
                });
                break;
            case 'year':
                // This year - All of 2024 (Jan through June so far)
                filteredClaims = filteredClaims.filter(claim => {
                    const claimDate = new Date(claim.dateSubmitted);
                    return claimDate.getFullYear() === 2024 && claimDate.getMonth() <= 5; // Jan through June
                });
                break;
        }
        
        // Update tables
        this.updateClaimsTable(filteredClaims);
    }

    updateClaimsTable(claims) {
        const tbody = document.getElementById('claimsTableBody');
        tbody.innerHTML = '';

        claims.forEach(claim => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${claim.id}</td>
                <td>${claim.clientName}</td>
                <td>${claim.patientName}</td>
                <td>${claim.procedure}</td>
                <td>$${claim.amount.toFixed(2)}</td>
                <td><span class="status-badge status-${claim.status.toLowerCase().replace(' ', '-')}">${claim.status}</span></td>
                <td>${new Date(claim.dateSubmitted).toLocaleDateString()}</td>
            `;
            tbody.appendChild(row);
        });
    }

    setupChat() {
        this.renderChatMessages();
    }

    renderChatMessages() {
        const chatMessages = document.getElementById('chatMessages');
        chatMessages.innerHTML = '';

        this.chatMessages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.type}`;
            
            messageDiv.innerHTML = `
                <div class="message-content">${message.content}</div>
                <div class="message-time">${message.time}</div>
            `;
            
            chatMessages.appendChild(messageDiv);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (message) {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            // Add user message
            this.chatMessages.push({
                type: 'user',
                content: message,
                time: timeString
            });
            
            // Add system response (simulated)
            setTimeout(() => {
                const responses = [
                    "Thank you for your message. We'll get back to you within 24 hours.",
                    "I understand your concern. Let me check that for you.",
                    "That's a great question. Let me connect you with our specialist.",
                    "I'll forward this to the appropriate team member.",
                    "Thank you for reaching out. We appreciate your business."
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                
                this.chatMessages.push({
                    type: 'system',
                    content: randomResponse,
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                });
                
                this.renderChatMessages();
            }, 1000);
            
            input.value = '';
            this.renderChatMessages();
        }
    }

    openAddClientModal() {
        document.getElementById('addClientModal').style.display = 'block';
    }

    closeAddClientModal() {
        document.getElementById('addClientModal').style.display = 'none';
        document.getElementById('addClientForm').reset();
    }

    addNewClient() {
        const formData = {
            name: document.getElementById('clientName').value,
            address: document.getElementById('clientAddress').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            providers: parseInt(document.getElementById('providerCount').value)
        };

        // Create new client object
        const newClient = {
            id: sampleData.clients.length + 1,
            ...formData,
            established: new Date().getFullYear().toString(),
            monthlyRevenue: Math.floor(Math.random() * 200000) + 50000,
            totalPatients: Math.floor(Math.random() * 2000) + 500,
            status: 'active'
        };

        // Add to data
        sampleData.clients.push(newClient);

        // Update UI
        this.populateClientFilter();
        this.populateClientsGrid();
        this.updateFinancialSummary();
        this.updateKeyMetrics();

        // Close modal
        this.closeAddClientModal();

        // Show success message
        this.showNotification('Client added successfully!', 'success');
    }

    removeClient(clientId) {
        if (confirm('Are you sure you want to remove this client?')) {
            sampleData.clients = sampleData.clients.filter(client => client.id !== clientId);
            this.populateClientFilter();
            this.populateClientsGrid();
            this.updateFinancialSummary();
            this.showNotification('Client removed successfully!', 'success');
        }
    }

    openAddWidgetModal() {
        document.getElementById('addWidgetModal').style.display = 'block';
    }

    closeAddWidgetModal() {
        document.getElementById('addWidgetModal').style.display = 'none';
        document.getElementById('addWidgetForm').reset();
    }

    addNewWidget() {
        const widgetType = document.getElementById('widgetType').value;
        const widgetTitle = document.getElementById('widgetTitle').value;

        if (!widgetType || !widgetTitle) return;

        const dashboardGrid = document.getElementById('dashboard-grid');
        const newWidget = document.createElement('div');
        newWidget.className = 'widget';
        newWidget.setAttribute('data-widget', widgetType);

        // Generate widget content based on type
        let widgetContent = this.generateWidgetContent(widgetType, widgetTitle);
        newWidget.innerHTML = widgetContent;

        dashboardGrid.appendChild(newWidget);
        this.closeAddWidgetModal();
        this.showNotification('Widget added successfully!', 'success');

        // Reinitialize charts if needed
        setTimeout(() => {
            this.initializeCharts();
            this.initializeCustomWidgetCharts();
        }, 100);
    }

    generateWidgetContent(type, title) {
        const widgetId = type + '-' + Date.now();
        
        switch(type) {
            case 'patient-demographics':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            case 'insurance-breakdown':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            case 'monthly-comparison':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            case 'denial-reasons':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            case 'provider-performance':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            case 'payment-trends':
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
            default:
                return `
                    <div class="widget-header">
                        <h3>${title}</h3>
                        <div class="widget-menu-container">
                            <button class="widget-settings">⋮</button>
                            <div class="widget-dropdown">
                                <a href="#" class="dropdown-item">Edit Widget</a>
                                <a href="#" class="dropdown-item">Duplicate</a>
                                <a href="#" class="dropdown-item">Remove</a>
                            </div>
                        </div>
                    </div>
                    <div class="widget-content">
                        <canvas id="${widgetId}"></canvas>
                    </div>
                `;
        }
    }

    setupWidgetDropdowns() {
        document.addEventListener('click', (e) => {
            // Close all dropdowns
            document.querySelectorAll('.widget-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });

            // Handle widget settings button clicks
            if (e.target.classList.contains('widget-settings')) {
                e.stopPropagation();
                const dropdown = e.target.nextElementSibling;
                if (dropdown && dropdown.classList.contains('widget-dropdown')) {
                    dropdown.classList.toggle('show');
                }
            }

            // Handle dropdown item clicks
            if (e.target.classList.contains('dropdown-item')) {
                e.preventDefault();
                const action = e.target.textContent.trim();
                const widget = e.target.closest('.widget');
                
                switch(action) {
                    case 'Edit Widget':
                        this.editWidget(widget);
                        break;
                    case 'Duplicate':
                        this.duplicateWidget(widget);
                        break;
                    case 'Remove':
                        this.removeWidget(widget);
                        break;
                }
            }
        });
    }

    editWidget(widget) {
        const title = widget.querySelector('h3').textContent;
        const newTitle = prompt('Edit widget title:', title);
        if (newTitle && newTitle.trim()) {
            widget.querySelector('h3').textContent = newTitle.trim();
            this.showNotification('Widget updated successfully!', 'success');
        }
    }

    duplicateWidget(widget) {
        const widgetType = widget.getAttribute('data-widget');
        const title = widget.querySelector('h3').textContent;
        const newTitle = title + ' (Copy)';
        
        const dashboardGrid = document.getElementById('dashboard-grid');
        const newWidget = document.createElement('div');
        newWidget.className = 'widget';
        newWidget.setAttribute('data-widget', widgetType);
        
        const widgetContent = this.generateWidgetContent(widgetType, newTitle);
        newWidget.innerHTML = widgetContent;
        
        dashboardGrid.appendChild(newWidget);
        this.showNotification('Widget duplicated successfully!', 'success');
        
        // Reinitialize charts
        setTimeout(() => {
            this.initializeCharts();
        }, 100);
    }

    removeWidget(widget) {
        if (confirm('Are you sure you want to remove this widget?')) {
            widget.remove();
            this.showNotification('Widget removed successfully!', 'success');
        }
    }

    resetDashboardLayout() {
        if (confirm('Are you sure you want to reset the dashboard layout?')) {
            localStorage.removeItem('dashboardLayout');
            location.reload();
        }
    }

    openAddClaimModal() {
        // Populate client dropdown
        const clientSelect = document.getElementById('claimClient');
        clientSelect.innerHTML = '<option value="">Select Client</option>';
        sampleData.clients.forEach(client => {
            const option = document.createElement('option');
            option.value = client.id;
            option.textContent = client.name;
            clientSelect.appendChild(option);
        });

        document.getElementById('addClaimModal').style.display = 'block';
    }

    closeAddClaimModal() {
        document.getElementById('addClaimModal').style.display = 'none';
        document.getElementById('addClaimForm').reset();
    }

    addNewClaim() {
        const formData = {
            clientId: parseInt(document.getElementById('claimClient').value),
            patientName: document.getElementById('claimPatient').value,
            procedure: document.getElementById('claimProcedure').value,
            amount: parseFloat(document.getElementById('claimAmount').value),
            insurance: document.getElementById('claimInsurance').value,
            status: document.getElementById('claimStatus').value
        };

        const client = sampleData.clients.find(c => c.id === formData.clientId);
        
        const newClaim = {
            id: `CLM-2024-${String(sampleData.claims.length + 1).padStart(3, '0')}`,
            clientId: formData.clientId,
            clientName: client.name,
            patientId: `PAT-${String(sampleData.patients.length + 1).padStart(3, '0')}`,
            patientName: formData.patientName,
            procedure: formData.procedure,
            cptCode: '99213',
            amount: formData.amount,
            status: formData.status,
            dateSubmitted: new Date().toISOString().split('T')[0],
            dateProcessed: formData.status === 'Paid' ? new Date().toISOString().split('T')[0] : null,
            insurance: formData.insurance
        };

        // Add to data
        sampleData.claims.push(newClaim);

        // Update UI
        this.populateClaimsTable();
        this.updateFinancialSummary();
        this.updateKeyMetrics();

        // Close modal
        this.closeAddClaimModal();
        this.showNotification('Claim added successfully!', 'success');
    }

    updateFinancialSummary() {
        const totalBilled = sampleData.claims.reduce((sum, claim) => sum + claim.amount, 0);
        const paidClaims = sampleData.claims.filter(claim => claim.status === 'Paid');
        const totalCollected = paidClaims.reduce((sum, claim) => sum + claim.amount, 0);
        const outstandingClaims = sampleData.claims.filter(claim => claim.status === 'Pending' || claim.status === 'Under Review');
        const totalOutstanding = outstandingClaims.reduce((sum, claim) => sum + claim.amount, 0);
        const deniedClaims = sampleData.claims.filter(claim => claim.status === 'Denied');
        const totalWriteoffs = deniedClaims.reduce((sum, claim) => sum + claim.amount, 0);

        // Update financial summary display
        const financialCards = document.querySelectorAll('.financial-card');
        if (financialCards.length >= 4) {
            financialCards[0].querySelector('.amount').textContent = `$${totalBilled.toLocaleString()}`;
            financialCards[1].querySelector('.amount').textContent = `$${totalCollected.toLocaleString()}`;
            financialCards[2].querySelector('.amount').textContent = `$${totalOutstanding.toLocaleString()}`;
            financialCards[3].querySelector('.amount').textContent = `$${totalWriteoffs.toLocaleString()}`;
        }
    }

    updateKeyMetrics() {
        const totalRevenue = sampleData.claims
            .filter(claim => claim.status === 'Paid')
            .reduce((sum, claim) => sum + claim.amount, 0);
        
        const totalClaims = sampleData.claims.length;
        const avgProcessingTime = 3.2; // This could be calculated from actual data
        const collectionRate = totalClaims > 0 ? (sampleData.claims.filter(claim => claim.status === 'Paid').length / totalClaims * 100).toFixed(1) : 0;

        // Update key metrics display
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toLocaleString()}`;
        document.getElementById('totalClaims').textContent = totalClaims.toLocaleString();
        document.getElementById('avgProcessingTime').textContent = avgProcessingTime.toString();
        document.getElementById('collectionRate').textContent = `${collectionRate}%`;
    }

    initializeDragAndDrop() {
        const dashboardGrid = document.getElementById('dashboard-grid');
        
        if (dashboardGrid && typeof Sortable !== 'undefined') {
            this.sortableInstance = new Sortable(dashboardGrid, {
                animation: 150,
                ghostClass: 'sortable-ghost',
                chosenClass: 'sortable-chosen',
                dragClass: 'sortable-drag',
                onEnd: (evt) => {
                    console.log('Widget moved from', evt.oldIndex, 'to', evt.newIndex);
                    this.saveDashboardLayout();
                }
            });
        }
    }

    saveDashboardLayout() {
        const widgets = Array.from(document.querySelectorAll('.widget'));
        const layout = widgets.map(widget => ({
            id: widget.getAttribute('data-widget'),
            order: Array.from(widgets).indexOf(widget)
        }));
        
        // Save to localStorage (in a real app, this would be saved to a database)
        localStorage.setItem('dashboardLayout', JSON.stringify(layout));
        this.showNotification('Dashboard layout saved!', 'success');
    }

    loadDashboardLayout() {
        const savedLayout = localStorage.getItem('dashboardLayout');
        if (savedLayout) {
            const layout = JSON.parse(savedLayout);
            // Apply saved layout
            console.log('Loaded dashboard layout:', layout);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(135deg, #4caf50, #45a049)' : 'linear-gradient(135deg, #2196f3, #1976d2)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .sortable-ghost {
        opacity: 0.4;
    }
    
    .sortable-chosen {
        transform: scale(1.02);
    }
    
    .sortable-drag {
        transform: rotate(5deg);
    }
    
    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 12px;
        font-size: 0.8rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    .status-paid {
        background: rgba(76, 175, 80, 0.2);
        color: #4caf50;
        border: 1px solid rgba(76, 175, 80, 0.3);
    }
    
    .status-pending {
        background: rgba(255, 152, 0, 0.2);
        color: #ff9800;
        border: 1px solid rgba(255, 152, 0, 0.3);
    }
    
    .status-denied {
        background: rgba(244, 67, 54, 0.2);
        color: #f44336;
        border: 1px solid rgba(244, 67, 54, 0.3);
    }
    
    .status-under-review {
        background: rgba(33, 150, 243, 0.2);
        color: #2196f3;
        border: 1px solid rgba(33, 150, 243, 0.3);
    }
`;
document.head.appendChild(style);
