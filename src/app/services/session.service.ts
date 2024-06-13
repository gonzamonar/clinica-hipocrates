import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionService {
  private user: any | null = null;
  private adminList: string[] = [];

  constructor() { }

  updateSession(user: any){
    this.user = user;
  }

  getCurrentUser(){
    return this.user?.email;
  }

  isSessionActive(): boolean {
    return this.user != null;
  }

  closeSession(){
    this.user = null;
  }

  isAdminLevelSession(): boolean {
    return this.user != null && this.adminList.includes(this.user.email);
  }
}
