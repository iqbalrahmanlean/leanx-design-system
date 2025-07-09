<template>
  <div class="advanced-table-demo">
    <div class="data-table-card">
      <!-- Header -->
      <div class="data-table-header">
        <h2 class="data-table-title">📊 Advanced Data Table</h2>
        <p class="data-table-description">
          Complete data table with sorting, filtering, pagination, and more
        </p>
      </div>

      <div class="data-table-content">
        <!-- Controls -->
        <div class="data-table-controls">
          <div class="data-table-controls-left">
            <!-- Global Search -->
            <div class="data-table-search-wrapper">
              <span class="data-table-search-icon">🔍</span>
              <input 
                v-model="globalFilter"
                class="input data-table-search" 
                placeholder="Search all columns..." 
              />
            </div>

            <!-- Filters -->
            <div class="filter-button">
              <button 
                class="btn btn-outline"
                @click="showFilters = !showFilters"
              >
                <span>🔽</span>
                Filters
                <span v-if="activeFiltersCount" class="filter-badge">
                  {{ activeFiltersCount }}
                </span>
              </button>
            </div>
          </div>

          <div class="data-table-controls-right">
            <!-- View Presets -->
            <select v-model="currentView" class="input" style="width: auto;">
              <option value="all">All Columns</option>
              <option value="basic">Basic Info</option>
              <option value="contact">Contact Details</option>
            </select>

            <!-- Column Toggle -->
            <button class="btn btn-outline" @click="showColumnToggle = !showColumnToggle">
              <span>📋</span> Columns
            </button>

            <!-- Export -->
            <button class="btn btn-outline" @click="exportData">
              <span>📥</span> Export
            </button>
          </div>
        </div>

        <!-- Filters Panel -->
        <div v-if="showFilters" class="filter-panel" style="background: hsl(var(--muted) / 0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
              <label class="filter-label">Status</label>
              <select v-model="filters.status" class="input">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Role</label>
              <select v-model="filters.role" class="input">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label class="filter-label">Department</label>
              <select v-model="filters.department" class="input">
                <option value="">All Departments</option>
                <option value="engineering">Engineering</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
                <option value="support">Support</option>
              </select>
            </div>
          </div>
          <button v-if="activeFiltersCount > 0" @click="clearFilters" class="btn btn-outline filter-clear-btn">
            Clear All Filters
          </button>
        </div>

        <!-- Column Toggle Panel -->
        <div v-if="showColumnToggle" class="column-toggle-content" style="background: hsl(var(--muted) / 0.3); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
          <div class="boolean-filter" v-for="col in availableColumns" :key="col.key">
            <input 
              type="checkbox" 
              class="checkbox" 
              :checked="visibleColumns.includes(col.key)"
              @change="toggleColumn(col.key)"
            />
            <label>{{ col.label }}</label>
          </div>
        </div>

        <!-- Table -->
        <div class="table-container">
          <table class="table table-striped">
            <thead class="table-header">
              <tr class="table-header-row">
                <th class="table-head table-select-all">
                  <input type="checkbox" class="checkbox" v-model="selectAll" @change="toggleSelectAll" />
                </th>
                <th 
                  v-for="col in visibleTableColumns" 
                  :key="col.key" 
                  class="table-head table-head-sortable"
                  @click="sortBy(col.key)"
                >
                  <div class="table-head-content">
                    {{ col.label }}
                    <span class="table-head-sort-icon">{{ getSortIcon(col.key) }}</span>
                  </div>
                </th>
                <th class="table-head">Actions</th>
              </tr>
            </thead>
            <tbody class="table-body">
              <template v-for="user in paginatedUsers" :key="user.id">
                <!-- Main Row -->
                <tr 
                  class="table-row table-row-clickable table-row-context-menu"
                  :class="{ 'table-row-selected': selectedUsers.includes(user.id) }"
                  @click="selectUser(user.id)"
                  @contextmenu.prevent="showContextMenu($event, user)"
                >
                  <td class="table-cell table-select-row">
                    <input 
                      type="checkbox" 
                      class="checkbox" 
                      :checked="selectedUsers.includes(user.id)"
                      @change.stop="toggleUser(user.id)"
                    />
                  </td>
                  <td v-if="visibleColumns.includes('name')" class="table-cell">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                      <div class="user-avatar">{{ user.name.charAt(0) }}</div>
                      {{ user.name }}
                    </div>
                  </td>
                  <td v-if="visibleColumns.includes('email')" class="table-cell">{{ user.email }}</td>
                  <td v-if="visibleColumns.includes('phone')" class="table-cell">{{ user.phone }}</td>
                  <td v-if="visibleColumns.includes('department')" class="table-cell">{{ user.department }}</td>
                  <td v-if="visibleColumns.includes('role')" class="table-cell">{{ user.role }}</td>
                  <td v-if="visibleColumns.includes('status')" class="table-cell">
                    <span 
                      class="badge"
                      :class="{
                        'badge-default': user.status === 'active',
                        'badge-secondary': user.status === 'inactive',
                        'badge-destructive': user.status === 'suspended'
                      }"
                    >
                      <span 
                        class="table-status-dot"
                        :class="{
                          'table-status-active': user.status === 'active',
                          'table-status-inactive': user.status === 'inactive',
                          'table-status-pending': user.status === 'suspended'
                        }"
                      ></span>
                      {{ user.status }}
                    </span>
                  </td>
                  <td v-if="visibleColumns.includes('joinDate')" class="table-cell">{{ formatDate(user.joinDate) }}</td>
                  <td v-if="visibleColumns.includes('lastActive')" class="table-cell">{{ formatDate(user.lastActive) }}</td>
                  <td class="table-cell">
                    <div class="table-row-actions">
                      <button class="btn btn-outline btn-sm" @click.stop="editUser(user)">Edit</button>
                      <button class="btn btn-destructive btn-sm" @click.stop="deleteUser(user)">Delete</button>
                    </div>
                  </td>
                </tr>

                <!-- Expanded Row (if expanded) -->
                <tr v-if="expandedRows.includes(user.id)" class="table-row">
                  <td :colspan="visibleTableColumns.length + 2" class="table-cell">
                    <div class="table-expanded-content">
                      <h4>Additional Details</h4>
                      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-top: 1rem;">
                        <div><strong>Employee ID:</strong> {{ user.employeeId }}</div>
                        <div><strong>Manager:</strong> {{ user.manager }}</div>
                        <div><strong>Location:</strong> {{ user.location }}</div>
                        <div><strong>Salary:</strong> ${{ user.salary?.toLocaleString() }}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="data-table-pagination">
          <div class="pagination-select-wrapper">
            <span class="pagination-info">Rows per page:</span>
            <select v-model="pageSize" class="input" style="width: 4rem;">
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>

          <div class="pagination-controls">
            <button 
              class="btn btn-outline pagination-button pagination-button-hidden"
              :disabled="currentPage === 1"
              @click="currentPage = 1"
            >
              ⏮️
            </button>
            <button 
              class="btn btn-outline pagination-button" 
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              ⏪
            </button>
            <div class="pagination-page-info">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <button 
              class="btn btn-outline pagination-button" 
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              ⏩
            </button>
            <button 
              class="btn btn-outline pagination-button pagination-button-hidden"
              :disabled="currentPage === totalPages"
              @click="currentPage = totalPages"
            >
              ⏭️
            </button>
          </div>

          <div class="pagination-info">
            Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredUsers.length }} results
          </div>
        </div>
      </div>
    </div>

    <!-- Context Menu (if shown) -->
    <div 
      v-if="contextMenu.show" 
      class="context-menu-content"
      :style="{ 
        position: 'fixed', 
        top: contextMenu.y + 'px', 
        left: contextMenu.x + 'px',
        background: 'hsl(var(--card))',
        border: '1px solid hsl(var(--border))',
        borderRadius: '8px',
        padding: '0.5rem',
        zIndex: 1000,
        minWidth: '12rem',
        boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)'
      }"
      @click.stop
    >
      <div class="context-menu-item" @click="copyUser('json')">
        <span class="context-menu-item-icon">📋</span>
        Copy as JSON
      </div>
      <div class="context-menu-item" @click="copyUser('csv')">
        <span class="context-menu-item-icon">📄</span>
        Copy as CSV
      </div>
      <div style="height: 1px; background: hsl(var(--border)); margin: 0.25rem 0;"></div>
      <div class="context-menu-item" @click="viewDetails">
        <span class="context-menu-item-icon">👁️</span>
        View Details
      </div>
      <div class="context-menu-item" @click="editUser(contextMenu.user)">
        <span class="context-menu-item-icon">✏️</span>
        Edit
      </div>
      <div style="height: 1px; background: hsl(var(--border)); margin: 0.25rem 0;"></div>
      <div class="context-menu-item context-menu-item-destructive" @click="deleteUser(contextMenu.user)">
        <span class="context-menu-item-icon">🗑️</span>
        Delete
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdvancedTableDemo',
  data() {
    return {
      globalFilter: '',
      showFilters: false,
      showColumnToggle: false,
      selectAll: false,
      selectedUsers: [],
      expandedRows: [],
      currentPage: 1,
      pageSize: 10,
      sortField: '',
      sortDirection: 'asc',
      currentView: 'all',
      filters: {
        status: '',
        role: '',
        department: ''
      },
      contextMenu: {
        show: false,
        x: 0,
        y: 0,
        user: null
      },
      visibleColumns: ['name', 'email', 'department', 'role', 'status', 'joinDate'],
      availableColumns: [
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Phone' },
        { key: 'department', label: 'Department' },
        { key: 'role', label: 'Role' },
        { key: 'status', label: 'Status' },
       { key: 'joinDate', label: 'Join Date' },
       { key: 'lastActive', label: 'Last Active' }
     ],
     users: [
       { 
         id: 1, 
         name: 'John Doe', 
         email: 'john@example.com', 
         phone: '+1 555-0101',
         department: 'engineering',
         role: 'admin', 
         status: 'active',
         joinDate: new Date('2023-01-15'),
         lastActive: new Date('2024-12-09'),
         employeeId: 'EMP001',
         manager: 'Sarah Johnson',
         location: 'New York',
         salary: 120000
       },
       { 
         id: 2, 
         name: 'Jane Smith', 
         email: 'jane@example.com', 
         phone: '+1 555-0102',
         department: 'marketing',
         role: 'user', 
         status: 'active',
         joinDate: new Date('2023-03-20'),
         lastActive: new Date('2024-12-08'),
         employeeId: 'EMP002',
         manager: 'Michael Brown',
         location: 'San Francisco',
         salary: 85000
       },
       { 
         id: 3, 
         name: 'Bob Johnson', 
         email: 'bob@example.com', 
         phone: '+1 555-0103',
         department: 'sales',
         role: 'user', 
         status: 'inactive',
         joinDate: new Date('2022-11-10'),
         lastActive: new Date('2024-11-15'),
         employeeId: 'EMP003',
         manager: 'Lisa Davis',
         location: 'Chicago',
         salary: 75000
       },
       { 
         id: 4, 
         name: 'Alice Brown', 
         email: 'alice@example.com', 
         phone: '+1 555-0104',
         department: 'engineering',
         role: 'editor', 
         status: 'active',
         joinDate: new Date('2023-07-05'),
         lastActive: new Date('2024-12-09'),
         employeeId: 'EMP004',
         manager: 'John Doe',
         location: 'Seattle',
         salary: 95000
       },
       { 
         id: 5, 
         name: 'Charlie Wilson', 
         email: 'charlie@example.com', 
         phone: '+1 555-0105',
         department: 'support',
         role: 'user', 
         status: 'suspended',
         joinDate: new Date('2023-09-12'),
         lastActive: new Date('2024-10-20'),
         employeeId: 'EMP005',
         manager: 'Diana Prince',
         location: 'Austin',
         salary: 65000
       },
       { 
         id: 6, 
         name: 'Diana Prince', 
         email: 'diana@example.com', 
         phone: '+1 555-0106',
         department: 'support',
         role: 'admin', 
         status: 'active',
         joinDate: new Date('2022-05-18'),
         lastActive: new Date('2024-12-09'),
         employeeId: 'EMP006',
         manager: 'Sarah Johnson',
         location: 'Boston',
         salary: 110000
       },
       { 
         id: 7, 
         name: 'Edward Norton', 
         email: 'edward@example.com', 
         phone: '+1 555-0107',
         department: 'marketing',
         role: 'user', 
         status: 'active',
         joinDate: new Date('2023-12-01'),
         lastActive: new Date('2024-12-08'),
         employeeId: 'EMP007',
         manager: 'Michael Brown',
         location: 'Los Angeles',
         salary: 70000
       },
       { 
         id: 8, 
         name: 'Fiona Green', 
         email: 'fiona@example.com', 
         phone: '+1 555-0108',
         department: 'engineering',
         role: 'editor', 
         status: 'inactive',
         joinDate: new Date('2023-02-28'),
         lastActive: new Date('2024-11-30'),
         employeeId: 'EMP008',
         manager: 'John Doe',
         location: 'Portland',
         salary: 90000
       }
     ]
   }
 },
 computed: {
   filteredUsers() {
     let filtered = this.users;
     
     // Apply global search
     if (this.globalFilter) {
       const searchTerm = this.globalFilter.toLowerCase();
       filtered = filtered.filter(user => 
         user.name.toLowerCase().includes(searchTerm) ||
         user.email.toLowerCase().includes(searchTerm) ||
         user.department.toLowerCase().includes(searchTerm) ||
         user.role.toLowerCase().includes(searchTerm) ||
         user.status.toLowerCase().includes(searchTerm)
       );
     }
     
     // Apply column filters
     if (this.filters.status) {
       filtered = filtered.filter(user => user.status === this.filters.status);
     }
     if (this.filters.role) {
       filtered = filtered.filter(user => user.role === this.filters.role);
     }
     if (this.filters.department) {
       filtered = filtered.filter(user => user.department === this.filters.department);
     }
     
     // Apply sorting
     if (this.sortField) {
       filtered.sort((a, b) => {
         let aVal = a[this.sortField];
         let bVal = b[this.sortField];
         
         // Handle dates
         if (aVal instanceof Date) {
           aVal = aVal.getTime();
           bVal = bVal.getTime();
         } else if (typeof aVal === 'string') {
           aVal = aVal.toLowerCase();
           bVal = bVal.toLowerCase();
         }
         
         if (this.sortDirection === 'asc') {
           return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
         } else {
           return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
         }
       });
     }
     
     return filtered;
   },
   paginatedUsers() {
     const start = (this.currentPage - 1) * this.pageSize;
     return this.filteredUsers.slice(start, start + this.pageSize);
   },
   totalPages() {
     return Math.ceil(this.filteredUsers.length / this.pageSize);
   },
   startIndex() {
     return (this.currentPage - 1) * this.pageSize;
   },
   endIndex() {
     return Math.min(this.startIndex + this.pageSize, this.filteredUsers.length);
   },
   activeFiltersCount() {
     let count = 0;
     if (this.globalFilter) count++;
     if (this.filters.status) count++;
     if (this.filters.role) count++;
     if (this.filters.department) count++;
     return count;
   },
   visibleTableColumns() {
     return this.availableColumns.filter(col => this.visibleColumns.includes(col.key));
   }
 },
 methods: {
   sortBy(field) {
     if (this.sortField === field) {
       this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
     } else {
       this.sortField = field;
       this.sortDirection = 'asc';
     }
   },
   getSortIcon(field) {
     if (this.sortField !== field) return '↕️';
     return this.sortDirection === 'asc' ? '↑' : '↓';
   },
   toggleSelectAll() {
     if (this.selectAll) {
       this.selectedUsers = this.paginatedUsers.map(u => u.id);
     } else {
       this.selectedUsers = [];
     }
   },
   toggleUser(userId) {
     const index = this.selectedUsers.indexOf(userId);
     if (index > -1) {
       this.selectedUsers.splice(index, 1);
     } else {
       this.selectedUsers.push(userId);
     }
     this.selectAll = this.selectedUsers.length === this.paginatedUsers.length;
   },
   selectUser(userId) {
     // Toggle expansion
     const index = this.expandedRows.indexOf(userId);
     if (index > -1) {
       this.expandedRows.splice(index, 1);
     } else {
       this.expandedRows.push(userId);
     }
   },
   clearFilters() {
     this.globalFilter = '';
     this.filters = {
       status: '',
       role: '',
       department: ''
     };
   },
   toggleColumn(columnKey) {
     const index = this.visibleColumns.indexOf(columnKey);
     if (index > -1) {
       this.visibleColumns.splice(index, 1);
     } else {
       this.visibleColumns.push(columnKey);
     }
   },
   formatDate(date) {
     return date.toLocaleDateString('en-US', {
       year: 'numeric',
       month: 'short',
       day: 'numeric'
     });
   },
   showContextMenu(event, user) {
     this.contextMenu = {
       show: true,
       x: event.clientX,
       y: event.clientY,
       user: user
     };
   },
   copyUser(format) {
     const user = this.contextMenu.user;
     let textToCopy = '';
     
     if (format === 'json') {
       textToCopy = JSON.stringify(user, null, 2);
     } else if (format === 'csv') {
       const headers = Object.keys(user).join(',');
       const values = Object.values(user).map(v => 
         v instanceof Date ? v.toISOString() : v
       ).join(',');
       textToCopy = `${headers}\n${values}`;
     }
     
     navigator.clipboard.writeText(textToCopy).then(() => {
       alert(`User data copied as ${format.toUpperCase()}!`);
       this.contextMenu.show = false;
     });
   },
   viewDetails() {
     alert(`Viewing details for: ${this.contextMenu.user.name}`);
     this.contextMenu.show = false;
   },
   editUser(user) {
     alert(`Editing user: ${user.name}`);
     this.contextMenu.show = false;
   },
   deleteUser(user) {
     if (confirm(`Are you sure you want to delete ${user.name}?`)) {
       alert(`User ${user.name} deleted!`);
       this.contextMenu.show = false;
     }
   },
   exportData() {
     const csv = [
       // Headers
       this.visibleTableColumns.map(col => col.label).join(','),
       // Data
       ...this.filteredUsers.map(user => 
         this.visibleTableColumns.map(col => {
           const value = user[col.key];
           return value instanceof Date ? value.toISOString() : value;
         }).join(',')
       )
     ].join('\n');
     
     const blob = new Blob([csv], { type: 'text/csv' });
     const url = window.URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = 'users-export.csv';
     a.click();
     window.URL.revokeObjectURL(url);
   }
 },
 watch: {
   pageSize() {
     this.currentPage = 1;
   },
   globalFilter() {
     this.currentPage = 1;
   },
   'filters.status'() {
     this.currentPage = 1;
   },
   'filters.role'() {
     this.currentPage = 1;
   },
   'filters.department'() {
     this.currentPage = 1;
   },
   currentView(newView) {
     switch (newView) {
       case 'basic':
         this.visibleColumns = ['name', 'role', 'status'];
         break;
       case 'contact':
         this.visibleColumns = ['name', 'email', 'phone', 'department'];
         break;
       default:
         this.visibleColumns = ['name', 'email', 'department', 'role', 'status', 'joinDate'];
     }
   }
 },
 mounted() {
   // Close context menu when clicking outside
   document.addEventListener('click', () => {
     this.contextMenu.show = false;
   });
 }
}
</script>

<style scoped>
.advanced-table-demo {
 margin: 2rem 0;
}

.user-avatar {
 width: 2rem;
 height: 2rem;
 background: #f1f5f9;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-weight: 600;
 font-size: 0.75rem;
 color: #475569;
}

.context-menu-item {
 display: flex;
 align-items: center;
 padding: 0.5rem;
 cursor: pointer;
 border-radius: 4px;
 font-size: 0.875rem;
}

.context-menu-item:hover {
 background-color: hsl(var(--muted));
}

.context-menu-item-destructive:hover {
 background-color: hsl(var(--destructive) / 0.1);
 color: hsl(var(--destructive));
}
</style>
