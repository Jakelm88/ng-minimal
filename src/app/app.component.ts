import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, NgForm, Validators } from '@angular/forms';
import { Post, PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  defaultUserId = 0;
  form: UntypedFormGroup;
  post: Post = { title: '', userId: this.defaultUserId };
  msg = '';

  constructor(
    private postsService: PostsService,
    private formBuilder: UntypedFormBuilder
  ) {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(4)]],
      body: '',
    });
  }

  ngOnInit(): void {}

  timeoutMsg() {
    setTimeout(() => {
      this.msg = '';
    }, 2000);
  }

  resetForm() {
    this.post = { title: '', userId: this.defaultUserId };
  }

  onSubmit() {
    let value = this.form.value;
    if (value.title != this.post.title && value.body != this.post.body) {
      this.post = { ...value, userId: this.defaultUserId };
      this.postsService.addPost(this.post).subscribe((res) => {
        this.post = res;
        this.msg = 'Post #' + this.post.id + ' added successfully.';
        this.timeoutMsg();
      });
    } else {
      this.msg = "This post isn't original.";
      this.timeoutMsg();
    }
  }

  updatePost() {
    this.msg = 'Not implemented yet.';
    this.timeoutMsg();
    /*
    if (
      this.post.userId == this.defaultUserId &&
      typeof this.post.id != undefined
    ) {
      this.post = { ...this.post, ...this.form.value };
      this.postsService.updatePost(this.post).subscribe();
    } else {
      this.msg = 'Error';
      this.timeoutMsg();
    }
    */
  }

  getPost(form: NgForm) {
    this.postsService.getPost(form.value.postId).subscribe((res) => {
      this.post = res;
      this.form.patchValue({ title: this.post.title, body: this.post.body });
    });
  }

  deletePost(form: NgForm) {
    this.postsService.deletePost(form.value.postId).subscribe((res) => {
      if (res.status == 200) {
        this.msg =
          'Post #' + form.value.postId + ' has been removed from server.';
        this.timeoutMsg();
      }
    });
  }
}
