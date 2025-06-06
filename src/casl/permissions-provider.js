
import React, { createContext, useContext, useEffect, useState } from 'react';
import { defineAbilityFor } from './ability.ts';
import { decryptData } from '../storageHelper.ts';
 
const PermissionsContext = createContext(undefined);
 
export const PermissionsProvider = ({ children }) => {
  const [ability, setAbility] = useState(() => defineAbilityFor([]));
 
  useEffect(() => {
    // const userPermissions = localStorage.getItem('permissions'); 
    const encryptedPermission = localStorage.getItem('permission');
const userPermissions = decryptData(encryptedPermission);  
    if (userPermissions) {
      try {
        // const parsedPermissions = userPermissions ? JSON.parse(userPermissions) : [];
        const newAbility = defineAbilityFor(userPermissions);
        setAbility(newAbility);
      } catch (error) {
        console.error('Failed to parse permissions:', error);
      }
    }
  }, []);
 
  return (
    <PermissionsContext.Provider value={ability}>
      {children}
    </PermissionsContext.Provider>
  );
};
 
// Custom hook to use the Permissions context
export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
 
 