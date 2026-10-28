<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the reproductive-health dashboard desktop-first, with a collapsible left rail and a mobile bottom navigation, so both form factors feel native.

- Single shared backend: every app (menstruapp and future siblings) writes to `public.checkins` (tagged by `app` + `tipo`, payload in `dados` jsonb) linked to `public.pessoas`; files go to private bucket `checkins` under `<user_id>/...`. Why: one database feeds all front-ends.
