import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
// import { AsyncAction } from 'rxjs/internal/scheduler/AsyncAction';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { MemberProfile } from "../member-profile/member-profile";
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-member-detailed',
  imports: [ RouterLink, RouterLinkActive, MemberProfile, RouterOutlet, AgePipe],
  templateUrl: './member-detailed.html',
  styleUrl: './member-detailed.css',
})
export class MemberDetailed implements OnInit {


  //private memberService = inject(MemberService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
   protected title =signal<string | undefined>('Profile.');
  private accountService = inject(AccountService);
  protected isCurrentUser = computed(()=>{
    return this.accountService.currentUser()?.id === this.route.snapshot.paramMap.get('id');
  })
  protected memberService = inject(MemberService);


  ngOnInit(): void {
    //this.member$ = this.loadMember();


    this.title.set(this.route.firstChild?.snapshot?.title);
    //alert(this.route.firstChild?.snapshot?.title);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next:()=>{
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }

  // loadMember() {
  //   const id = this.route.snapshot.paramMap.get('id');
  //   if (!id) return;


  //   return this.memberService.getMember(id);
  // }





}
