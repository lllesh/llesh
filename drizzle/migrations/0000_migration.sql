CREATE TABLE public.pessoas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  nome text NOT NULL,
  relacao text NOT NULL DEFAULT 'eu',
  sexo text,
  nascimento date,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pessoas TO authenticated;
GRANT ALL ON public.pessoas TO service_role;
ALTER TABLE public.pessoas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dono gerencia pessoas" ON public.pessoas FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());

CREATE TABLE public.checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL DEFAULT auth.uid(),
  pessoa_id uuid REFERENCES public.pessoas(id) ON DELETE CASCADE,
  app text NOT NULL DEFAULT 'menstruapp',
  tipo text NOT NULL,
  dados jsonb NOT NULL DEFAULT '{}'::jsonb,
  midia_path text,
  audio_path text,
  transcricao text,
  ocorreu_em timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.checkins TO authenticated;
GRANT ALL ON public.checkins TO service_role;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dono gerencia checkins" ON public.checkins FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid());
CREATE INDEX checkins_owner_tempo ON public.checkins (owner_id, ocorreu_em DESC);
CREATE INDEX checkins_app_tipo ON public.checkins (app, tipo);