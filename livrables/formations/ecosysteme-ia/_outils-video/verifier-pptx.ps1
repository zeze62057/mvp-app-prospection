# Controle un .pptx avec PowerPoint : compte les animations lues par diapositive, exporte chaque
# diapositive en image (dossier "rendu" a cote du fichier) et affiche les notes de l'orateur.
#
#   powershell -File verifier-pptx.ps1 -Fichier "C:\chemin\diapositives-chapitre-2.pptx"
#
# Necessite PowerPoint installe. Le diaporama n'est pas joue : les images montrent l'etat final.
param([Parameter(Mandatory = $true)][string]$Fichier)

$Fichier = (Resolve-Path $Fichier).Path
$sortie = Join-Path (Split-Path $Fichier) 'rendu'
if (Test-Path $sortie) { Remove-Item $sortie -Recurse -Force }
New-Item -ItemType Directory -Path $sortie | Out-Null

$app = New-Object -ComObject PowerPoint.Application
try {
  $pres = $app.Presentations.Open($Fichier, -1, 0, 0)
  foreach ($s in $pres.Slides) {
    $seq = $s.TimeLine.MainSequence
    $clics = 0; $avec = 0; $apres = 0
    for ($i = 1; $i -le $seq.Count; $i++) {
      switch ($seq.Item($i).Timing.TriggerType) { 1 { $clics++ } 2 { $avec++ } 3 { $apres++ } }
    }
    $notes = ''
    try { $notes = $s.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text } catch {}
    "Diapo {0} : {1} effets (clics={2}, avec={3}, apres={4}), transition={5}, notes={6} car." -f $s.SlideIndex, $seq.Count, $clics, $avec, $apres, $s.SlideShowTransition.EntryEffect, $notes.Length
  }
  $pres.Export($sortie, 'PNG', 1920, 1080)
  $pres.Close()
} finally { $app.Quit() }
"Images : $sortie"
