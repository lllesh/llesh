CREATE POLICY "dono le arquivos" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'checkins' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "dono envia arquivos" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'checkins' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "dono apaga arquivos" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'checkins' AND (storage.foldername(name))[1] = auth.uid()::text);