# Controle un .pptx avec PowerPoint : compte les animations lues par diapositive, detecte les textes qui
# debordent de leur cadre ou qui laissent un mot seul en fin de ligne, exporte chaque diapositive en
# image (dossier "rendu" a cote du fichier) et affiche les notes de l'orateur.
#
#   powershell -NoProfile -ExecutionPolicy Bypass -File verifier-pptx.ps1 -Fichier "C:\chemin\diapositives-chapitre-2.pptx"
#
# Necessite PowerPoint installe. Le diaporama n'est pas joue : les images montrent l'etat final.
# Les lignes "ALERTE" sont a regarder : un debordement est toujours un vrai defaut, un mot seul est
# parfois voulu (titre coupe a la main).
param([Parameter(Mandatory = $true)][string]$Fichier)

$Fichier = (Resolve-Path $Fichier).Path
$sortie = Join-Path (Split-Path $Fichier) 'rendu'
if (Test-Path $sortie) { Remove-Item $sortie -Recurse -Force }
New-Item -ItemType Directory -Path $sortie | Out-Null

$app = New-Object -ComObject PowerPoint.Application
$alertes = 0
try {
  $pres = $app.Presentations.Open($Fichier, -1, 0, 0)
  $largeur = $pres.PageSetup.SlideWidth
  foreach ($s in $pres.Slides) {
    $seq = $s.TimeLine.MainSequence
    $clics = 0; $avec = 0; $apres = 0
    for ($i = 1; $i -le $seq.Count; $i++) {
      switch ($seq.Item($i).Timing.TriggerType) { 1 { $clics++ } 2 { $avec++ } 3 { $apres++ } }
    }
    $notes = ''
    try { $notes = $s.NotesPage.Shapes.Placeholders(2).TextFrame.TextRange.Text } catch {}
    "Diapo {0} : {1} effets (clics={2}, avec={3}, apres={4}), transition={5}, notes={6} car." -f $s.SlideIndex, $seq.Count, $clics, $avec, $apres, $s.SlideShowTransition.EntryEffect, $notes.Length

    foreach ($sh in $s.Shapes) {
      if (-not $sh.HasTextFrame) { continue }
      $tr = $sh.TextFrame.TextRange
      if ($tr.Text.Trim().Length -eq 0) { continue }
      $nom = $sh.Name
      $interieur = $sh.Height - $sh.TextFrame.MarginTop - $sh.TextFrame.MarginBottom
      if ($tr.BoundHeight -gt ($interieur + 2)) {
        "  ALERTE diapo {0} : le texte deborde en hauteur ({1}) : {2}" -f $s.SlideIndex, $nom, $tr.Text.Substring(0, [Math]::Min(50, $tr.Text.Length)); $alertes++
      }
      if (($sh.Left + $sh.Width) -gt ($largeur + 1) -or $sh.Left -lt -1) {
        "  ALERTE diapo {0} : l'element sort de la diapositive ({1})" -f $s.SlideIndex, $nom; $alertes++
      }
      if ($tr.Font.Name -eq 'Courier New' -or [regex]::IsMatch($tr.Text, "[`r`v`n]")) { continue }
      $n = $tr.Lines().Count
      if ($n -ge 2) {
        $derniere = $tr.Lines($n).Text.Trim()
        if (($derniere -split '\s+').Count -eq 1 -and $derniere.Length -lt 14) {
          "  ALERTE diapo {0} : mot seul en fin de ligne « {1} » ({2})" -f $s.SlideIndex, $derniere, $nom; $alertes++
        }
      }
      if ($nom -match '-titre$' -and $n -gt 3) {
        "  ALERTE diapo {0} : titre sur {1} lignes ({2})" -f $s.SlideIndex, $n, $nom; $alertes++
      }
    }
  }
  $pres.Export($sortie, 'PNG', 1920, 1080)
  $pres.Close()
} finally { $app.Quit() }
"Images : $sortie"
if ($alertes -eq 0) { "Aucune alerte de mise en page." } else { "$alertes alerte(s) de mise en page : a regarder sur les images." }
