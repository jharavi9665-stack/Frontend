/* ============================================================
   SCHOOL ERP – storage-utils.js
   Reusable LocalStorage Helper for Modular Data Management
============================================================ */

const STORAGE_KEYS = {
  ADMISSION: 'school_erp_admission_enquiries',
  VISITOR: 'school_erp_visitors',
  PHONE_LOG: 'school_erp_phone_logs',
  POSTAL_DISPATCH: 'school_erp_postal_dispatch',
  POSTAL_RECEIVE: 'school_erp_postal_receive',
  COMPLAINTS: 'school_erp_complaints',
  PURPOSE: 'school_erp_purposes',
  COMPLAINT_TYPE: 'school_erp_complaint_types',
  SOURCE: 'school_erp_sources',
  REFERENCE: 'school_erp_references'
};

const StorageUtils = {
  /**
   * Retrieve array of records for a given storage key.
   * If key is absent, seeds defaultData into localStorage.
   */
  get(key, defaultData = []) {
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        if (defaultData && defaultData.length > 0) {
          this.set(key, defaultData);
        }
        return defaultData;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error(`StorageUtils.get error for key "${key}":`, e);
      return defaultData;
    }
  },

  /**
   * Save an array/object to localStorage.
   */
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`StorageUtils.set error for key "${key}":`, e);
      return false;
    }
  },

  /**
   * Add a new record to the list stored under `key`.
   * Automatically generates a unique ID if not provided.
   */
  add(key, record, idField = 'id', prefix = 'ENQ') {
    const list = this.get(key, []);
    if (!record[idField]) {
      const maxNum = list.reduce((max, item) => {
        const val = String(item[idField] || '');
        const num = parseInt(val.replace(/\D/g, ''), 10);
        return !isNaN(num) && num > max ? num : max;
      }, 1000);
      record[idField] = `${prefix}${maxNum + 1}`;
    }
    list.unshift(record); // Add new record to top of list
    this.set(key, list);
    return record;
  },

  /**
   * Update an existing record in localStorage by ID.
   */
  update(key, id, updatedFields, idField = 'id') {
    const list = this.get(key, []);
    const index = list.findIndex(item => String(item[idField]) === String(id));
    if (index !== -1) {
      list[index] = { ...list[index], ...updatedFields, [idField]: id };
      this.set(key, list);
      return list[index];
    }
    return null;
  },

  /**
   * Delete a record from localStorage by ID.
   */
  delete(key, id, idField = 'id') {
    const list = this.get(key, []);
    const newList = list.filter(item => String(item[idField]) !== String(id));
    this.set(key, newList);
    return newList;
  },

  /**
   * Find a single record by ID.
   */
  getById(key, id, idField = 'id') {
    const list = this.get(key, []);
    return list.find(item => String(item[idField]) === String(id)) || null;
  }
};

window.STORAGE_KEYS = STORAGE_KEYS;
window.StorageUtils = StorageUtils;
