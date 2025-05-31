import { Component, OnInit } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table'; // MatTable helyett MatTableModule, ha önállóan használod
import { MatCardModule } from '@angular/material/card'; // MatCard, MatCardContent, stb. helyett MatCardModule
import { MatOption } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select'; // MatSelect helyett MatSelectModule
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-user-list',
  standalone: true,
  templateUrl: './admin-user-list.component.html',
  imports: [
    FormsModule,
    CommonModule,
    MatTableModule, // Itt a Module változat kell
    MatCardModule,   // Itt a Module változat kell
    MatFormFieldModule,
    MatOption, // Ez marad MatOption, mert önállóan van definiálva
    MatSelectModule, // Itt a Module változat kell
    MatButtonModule
  ],
  styleUrl: './admin-user-list.component.css'
})
export class AdminUserListComponent implements OnInit {
  users: User[] = [];
  // Feltételezzük, hogy a backend "ROLE_OPERATOR", "ROLE_MECHANIC", "ROLE_ADMIN" formátumot vár,
  // de a frontend "OPERATOR", "MECHANIC", "ADMIN" formátumban jeleníti meg.
  availableRoles: string[] = ['OPERATOR', 'MECHANIC', 'ADMIN'];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Hozzáadtam a 'username' oszlopot is, ahogy a konzol log alapján látszik, hogy van ilyen mező.
  // Így láthatod a felhasználóneveket is a táblában.
  displayedColumns: string[] = ['id', 'username', 'role', 'actions'];

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data: any[]) => { // A 'data' típusát 'any[]'-re állítjuk, mert nem illeszkedik pontosan a 'User[]'-re
        // Adatok átalakítása a 'User' interface-hez
        this.users = data.map(backendUser => {
          // Kinyerjük a szerepkört az 'authorities' tömbből.
          // Feltételezzük, hogy az első 'authority' objektum 'authority' mezője tartalmazza a szerepkört (pl. "ROLE_ADMIN").
          // Majd levágjuk a "ROLE_" előtagot a megjelenítéshez.
          const roleFromAuthorities = backendUser.authorities && backendUser.authorities.length > 0
            ? backendUser.authorities[0].authority.replace('ROLE_', '')
            : 'UNKNOWN'; // Ha nincs szerepkör, legyen "UNKNOWN"

          return {
            id: backendUser.id,
            username: backendUser.username,
            role: roleFromAuthorities // Ezt a mezőt fogja a 'mat-table' használni
          } as User; // Erősítsd meg, hogy a végleges objektum illeszkedik a 'User' interface-hez
        });
        console.log('Felhasználók sikeresen betöltve (átalakítva):', this.users);
      },
      error: (err) => {
        console.error('Nem sikerült betölteni a felhasználókat:', err);
      }
    });
  }

  onRoleChange(user: User, newRole: string): void {
    // A backend valószínűleg "ROLE_ADMIN" formátumot vár,
    // ezért hozzá kell adni a "ROLE_" előtagot, mielőtt elküldjük a backendnek.
    const roleForBackend = `ROLE_${newRole}`;

    if (confirm(`Biztosan megváltoztatja ${user.username} szerepkörét ${newRole}-ra?`)) {
      this.userService.updateUserRole(user.id, roleForBackend).subscribe({ // Küldd a helyes formátumot a backendnek
        next: () => {
          user.role = newRole; // Frissítjük a frontend oldali modellt a megjelenítéshez
          console.log(`Felhasználó (${user.username}) szerepköre sikeresen módosítva ${newRole}-ra.`);
        },
        error: (err) => {
          console.error(`Nem sikerült módosítani ${user.username} szerepköreit:`, err);
          // Opcionális: Hiba esetén visszaállíthatod az eredeti szerepkört a UI-n
          // user.role = originalRole;
        }
      });
    }
  }

  deleteUser(userId: number): void {
    if (confirm('Biztosan törli ezt a felhasználót? Ez visszavonhatatlan művelet!')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          console.log(`Felhasználó ID ${userId} sikeresen törölve.`);
        },
        error: (err) => {
          console.error(`Nem sikerült törölni a felhasználót ID ${userId}-vel:`, err);
        }
      });
    }
  }
}
