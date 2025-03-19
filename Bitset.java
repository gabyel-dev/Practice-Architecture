import java.util.BitSet;

interface Bitset {
    static void main(String[] args) {
        UserPermissions admin = new UserPermissions(UserRole.ADMIN);
        admin.listPermissions();

        UserPermissions client = new UserPermissions(UserRole.CLIENT);
        client.listPermissions();

        System.out.println("Can Client DELETE? " + client.hasPermission(Permission.DELETE)); 

        client.grantPermission(Permission.DELETE); // assigns delete to client this will return true
        System.out.println("Can Client DELETE? " + client.hasPermission(Permission.DELETE));  

        admin.revokePermission(Permission.EXECUTE); // remove execute to admin
        admin.listPermissions(); 
    }

    enum Permission {
        READ(0), WRITE(1), EXECUTE(2), DELETE(3); // list of permissions
        
        private final int bitIndex;

        Permission(int bitIndex) {
        this.bitIndex = bitIndex;
        }

        public int getBitIndex() {
        return bitIndex;
        }
    }

    enum UserRole {
        ADMIN, CLIENT
    }

    class UserPermissions {
        private BitSet permissions;
        private UserRole role;

        public UserPermissions(UserRole role) {
            this.role = role;
            this.permissions = new BitSet();
            setDefaultPermissions();
        }

        // Assigns permissions based on role
        private void setDefaultPermissions() {
            Permission[] defaultPermissions = (role == UserRole.ADMIN) 
                ? new Permission[]{Permission.READ, Permission.WRITE, Permission.EXECUTE, Permission.DELETE} 
                : new Permission[]{Permission.READ, Permission.EXECUTE};
        
            for (Permission p : defaultPermissions) {
                grantPermission(p);
            }
        }

        public void grantPermission(Permission permission) {
            permissions.set(permission.getBitIndex());
        }

        public void revokePermission(Permission permission) {
            permissions.clear(permission.getBitIndex());
        }

        public boolean hasPermission(Permission permission) {
            return permissions.get(permission.getBitIndex());
        }
        
        public void listPermissions() {
            System.out.print(role + " has permissions: ");
            for (Permission pmsn : Permission.values()) {
                if (permissions.get(pmsn.getBitIndex())) {
                    System.out.print(pmsn + " ");
                }
            }
            System.out.println();
        }
    }
}
