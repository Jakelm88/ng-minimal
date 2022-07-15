import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

export interface Post {
  readonly id?: number;
  title: string;
  body?: string;
  userId: number;
  userName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private serverUrl = 'https://jsonplaceholder.typicode.com/';

  constructor(private httpClient: HttpClient) {}

  getPost(postId: number) {
    return this.httpClient.get<Post>(this.serverUrl + 'posts/' + postId).pipe(
      map((res) => {
        this.httpClient
          .get(this.serverUrl + 'users/' + res.userId)
          .subscribe((user: { name?: string }) => {
            res.userName = user.name;
          });
        return res;
      })
    );
  }

  addPost(post: Post) {
    return this.httpClient
      .post<Post>(this.serverUrl + 'posts', JSON.stringify(post), {
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
      .pipe(tap(console.log));
  }

  updatePost(post: Post) {
    return this.httpClient
      .put(this.serverUrl + 'posts/' + post.id, JSON.stringify(post), {
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
      })
      .pipe(tap(console.log));
  }

  deletePost(postId: number) {
    return this.httpClient.delete(this.serverUrl + 'posts/' + postId, {
      observe: 'response',
    });
  }
}
