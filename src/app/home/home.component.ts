import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  commits: { date: string; message: string; sha?: string }[] = [];

  owner = 'yashraj-shitole';
  repo = 'learn-angular';
  error: string | null = null;
  hovered: { date: string; message: string } | null = null;
  // single-load state
  lastFetchedDate: string | null = null;

  constructor(private http: HttpClient) {}

  formatDate(d: string) {
    const dt = new Date(d);
    return dt.toLocaleString();
  }
  ngOnInit(): void {
    // load commits once at component initialization
    this.fetchAllCommits(this.owner, this.repo).subscribe({
      next: (arr) => {
        this.commits = arr;
        if (arr.length) this.lastFetchedDate = arr[0].date;
      },
      error: (err) => (this.error = err?.message || 'Failed to load commits')
    });
  }

  setHover(c: { date: string; message: string }) {
    this.hovered = c;
  }

  clearHover() {
    this.hovered = null;
  }

  // No polling: single-load only. Keep refresh removed per request.

  private fetchAllCommits(owner: string, repo: string) {
    const url = `https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`;
    return this.http.get<any[]>(url).pipe(
      map((arr) => {
        return (arr || []).map((it) => ({ date: it.commit?.author?.date || it.commit?.committer?.date || '', message: it.commit?.message || '', sha: it.sha }));
      })
    );
  }

  // removed incremental fetch — not needed for single-load mode

  // no teardown required for single-load mode
}
