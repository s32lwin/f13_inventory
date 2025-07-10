import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { poolData } from '../awsConfig';

const API_ENDPOINT = 'https://xe11sqsoyk.execute-api.us-east-1.amazonaws.com';
const userPool = new CognitoUserPool(poolData);

// Utility: Get Cognito ID token
async function getIdToken() {
  return new Promise((resolve, reject) => {
    const user = userPool.getCurrentUser();
    if (!user) {
      console.error('❌ No current user');
      return reject('User not logged in');
    }

    user.getSession((err, session) => {
      if (err) {
        console.error('❌ Session error:', err);
        return reject('Session retrieval failed');
      }
      if (!session.isValid()) {
        console.warn('❌ Session invalid');
        return reject('Invalid session');
      }

      const token = session.getIdToken().getJwtToken();
      console.log('✅ ID token (start):', token.slice(0, 30));
      resolve(token);
    });
  });
}

// Fetch all inventory items (no auth)
export async function fetchItems() {
  try {
    const response = await fetch(`${API_ENDPOINT}/items`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
}

// Fetch a single inventory item (no auth)
export async function fetchItem(itemId) {
  try {
    const response = await fetch(`${API_ENDPOINT}/items?itemId=${itemId}`);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching item ${itemId}:`, error);
    throw error;
  }
}

// ✅ Create a new inventory item (with auth)
export async function createItem(itemData) {
  try {
    const token = await getIdToken();
    console.log('Using token:', token.substring(0, 20), '...');

    const response = await fetch(`${API_ENDPOINT}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
}

// ✅ Update an existing inventory item (with auth)
export async function updateItem(itemData) {
  try {
    const token = await getIdToken();

    const response = await fetch(`${API_ENDPOINT}/items`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ✅ FIXED
      },
      body: JSON.stringify(itemData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error updating item ${itemData.itemId}:`, error);
    throw error;
  }
}

// ✅ Delete an inventory item (with auth)
export async function deleteItem(itemId) {
  try {
    const token = await getIdToken();

    const response = await fetch(`${API_ENDPOINT}/items?itemId=${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`  // ✅ FIXED
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    throw error;
  }
}
