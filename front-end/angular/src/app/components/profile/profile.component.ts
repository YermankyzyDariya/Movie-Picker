import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../services/profile.service';
import { Profile } from '../../models/profile';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {

  profile: Profile = {
    user: '',
    bio: '',
    favorite_genre: '',
    id: 0,
    created_at: ''
  };

  loading = true;

  constructor(private service: ProfileService) {}

  ngOnInit(): void {
    this.service.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  save() {
    this.service.updateProfile({
      bio: this.profile.bio,
      favorite_genre: this.profile.favorite_genre
    }).subscribe();
  }

  onBioChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profile.bio = input.value;
  }

  onGenreChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.profile.favorite_genre = input.value;
  }

}