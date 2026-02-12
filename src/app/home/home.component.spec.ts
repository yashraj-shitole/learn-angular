// Auto-generated test stubs for src/app/home/home.component.ts
import { of, throwError, firstValueFrom } from 'rxjs';
import { HomeComponent } from './home.component';

describe('src/app/home/home.component.ts', () => {
  it('formatDate should return the locale string for a date', () => {
    const http: any = {};
    const c = new HomeComponent(http as any);
    const iso = '2020-01-02T03:04:05Z';
    const expected = new Date(iso).toLocaleString();
    expect(c.formatDate(iso)).toBe(expected);
  });

  it('ngOnInit should load commits and set lastFetchedDate', () => {
    const mockApiResponse = [
      { commit: { author: { date: '2021-01-01T00:00:00Z' }, message: 'First' }, sha: 'a1' },
      { commit: { committer: { date: '2021-01-02T00:00:00Z' }, message: 'Second' }, sha: 'b2' }
    ];
    let called = false;
    const http: any = { get: (url: string) => { called = true; return of(mockApiResponse); } };
    const c = new HomeComponent(http as any);
    // ngOnInit should synchronously subscribe to the observable emitted by of(...)
    c.ngOnInit();
    expect(called).toBe(true);
    expect(c.commits.length).toBe(2);
    expect(c.commits[0].date).toBe('2021-01-01T00:00:00Z');
    expect(c.commits[0].message).toBe('First');
    expect(c.lastFetchedDate).toBe('2021-01-01T00:00:00Z');
    expect(c.error).toBeNull();
  });

  it('ngOnInit should set error when fetch fails', () => {
    const http: any = { get: (url: string) => throwError(() => new Error('boom')) };
    const c = new HomeComponent(http as any);
    c.ngOnInit();
    expect(c.commits.length).toBe(0);
    expect(c.error).toBe('boom');
  });

  it('setHover and clearHover should update hovered state', () => {
    const http: any = {};
    const c = new HomeComponent(http as any);
    const item = { date: 'd', message: 'm' };
    c.setHover(item);
    expect(c.hovered).toBe(item);
    c.clearHover();
    expect(c.hovered).toBeNull();
  });

  it('fetchAllCommits should map api shape to simplified commits', async () => {
    const api = [
      { commit: { author: { date: '2022-02-02T00:00:00Z' }, message: 'A' }, sha: 's1' },
      { commit: { committer: { date: '2022-02-03T00:00:00Z' }, message: 'B' }, sha: 's2' }
    ];
    const http: any = { get: (url: string) => of(api) };
    const c = new HomeComponent(http as any);
    const arr: any[] = await firstValueFrom((c as any).fetchAllCommits('o', 'r') as any);
    expect(arr.length).toBe(2);
    expect(arr[0]).toEqual({ date: '2022-02-02T00:00:00Z', message: 'A', sha: 's1' });
    expect(arr[1]).toEqual({ date: '2022-02-03T00:00:00Z', message: 'B', sha: 's2' });
  });
});
