# Stampabili

Sorgenti HTML degli allegati PDF stampabili linkati dalle guide. Non fanno parte del build del sito:
il PDF è renderizzato a mano e committato sotto `public/`, così la CI non ha bisogno di un browser headless.

| Sorgente                        | PDF generato                                     | Linkato da                       |
| ------------------------------- | ------------------------------------------------ | -------------------------------- |
| `scheda-preparazione-demo.html` | `public/guide/demo/scheda-preparazione-demo.pdf` | `guide/demo-eventi.md` (+ `-en`) |

## Rigenerare un PDF

Con Chrome o Edge in headless (Windows, PowerShell):

```powershell
Start-Process -Wait -NoNewWindow -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList @(
  "--headless=new", "--disable-gpu", "--no-pdf-header-footer", "--virtual-time-budget=5000",
  "--print-to-pdf=public/guide/demo/scheda-preparazione-demo.pdf",
  "file:///C:/src/vtesItaly.Site/scripts/printables/scheda-preparazione-demo.html"
)
```

`Start-Process -Wait` è necessario: `chrome.exe` è un binario GUI, quindi lanciato con `&` non blocca
la shell e si finisce a leggere il PDF precedente.

Dopo il render, verifica il numero di pagine (la scheda demo deve stare in **2** pagine A4,
un foglio fronte/retro):

```powershell
$s = [System.Text.Encoding]::GetEncoding(28591).GetString([IO.File]::ReadAllBytes($pdf))
[regex]::Matches($s, '/Count\s+(\d+)') | ForEach-Object { $_.Groups[1].Value }
```

## Note di layout

- Il layout è tarato per A4 con margini `@page` di 11×10 mm: ~1039×718 px di area utile a 96 dpi.
- La media query `@media screen and (max-width: 760px)` serve solo alla lettura a schermo; in stampa
  restano le griglie a 2/3 colonne. Attenzione se misuri il layout da una finestra stretta: la
  colonna singola falsa l'altezza del documento.
- `.pagebreak` forza lo stacco prima della traccia del round: pagina 1 = preparazione, pagina 2 = tavolo.
