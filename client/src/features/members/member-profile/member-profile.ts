import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { TimeAgoPipePipe } from '../../../core/pipes/time-ago-pipe-pipe';

@Component({
  selector: 'app-member-profile',
  imports: [DatePipe, FormsModule, TimeAgoPipePipe],
  templateUrl: './member-profile.html',
  styleUrl: './member-profile.css',
})
export class MemberProfile implements OnInit, OnDestroy {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload',['$event']) notify($event:BeforeUnloadEvent){
    if(this.editForm?.dirty){
      $event.preventDefault();

    }
  }
  //private route = inject(ActivatedRoute);
  //protected member = signal<Member | undefined>(undefined);
  protected memberService =inject(MemberService);
  protected accountService = inject(AccountService);
  protected editableMember:EditableMember={
    displayName:'',
    description:'',
    city:'',
    country:''
  }



  constructor(){

  }

  ngOnInit(): void {



       this.editableMember={
        displayName: this.memberService.member()?.displayName || '',
        description: this.memberService.member()?.description || '',

        city: this.memberService.member()?.city || '',
        country: this.memberService.member()?.country || ''
       }

  }

  ngOnDestroy(): void {
    if(this.memberService.editMode()){
      this.memberService.editMode.set(false);
    }
  }

  updateProfile()
  {
    if(!this.memberService.member()) return;

    const updatedMember = {...this.memberService.member(), ...this.editableMember}
    this.memberService.updateMember(this.editableMember).subscribe({
      next:()=>{
        const currentUser = this.accountService.currentUser();
        if(currentUser && updatedMember.displayName!==currentUser?.displayName){
          currentUser.displayName = updatedMember.displayName;
          this.accountService.setCurrentUser(currentUser);
        }
        alert('profile updated from member-profile');
        this.memberService.editMode.set(false);
        this.memberService.member.set(updatedMember as Member);
        this.editForm?.reset(updatedMember);
      }
    })

  }

}
