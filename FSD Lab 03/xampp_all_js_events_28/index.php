<?php /* XAMPP index for 28 individual JavaScript event examples */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>JavaScript Events - 28 XAMPP Examples</title>
<style>

*{box-sizing:border-box}
body{
    margin:0;
    min-height:100vh;
    font-family:Arial,Helvetica,sans-serif;
    color:#162033;
    background:
      radial-gradient(circle at 12% 15%,rgba(255,255,255,.75),transparent 25%),
      radial-gradient(circle at 88% 8%,rgba(255,255,255,.55),transparent 23%),
      linear-gradient(135deg,#f7efe3,#edf4ff);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:35px;
}
.app{
    width:min(980px,96vw);
    background:rgba(255,255,255,.92);
    border:1px solid rgba(255,255,255,.85);
    border-radius:30px;
    padding:34px;
    box-shadow:0 28px 80px rgba(24,39,75,.15);
}
.badge{
    display:inline-block;
    padding:8px 14px;
    border-radius:999px;
    background:#eef3ff;
    color:#4258b5;
    font-weight:700;
    font-size:13px;
}
h1{font-size:38px;margin:14px 0 8px}
.desc{font-size:18px;line-height:1.6;color:#5c6878;margin-bottom:25px}
.demo{
    background:#f8fbff;
    border:1px solid #e5eaf1;
    border-radius:24px;
    padding:28px;
    min-height:260px;
}
.row{display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap}
.btn{
    border:0;
    padding:16px 30px;
    border-radius:16px;
    color:white;
    background:linear-gradient(135deg,#6d5efc,#00b8d9);
    font-size:19px;
    font-weight:bold;
    cursor:pointer;
    box-shadow:0 14px 30px rgba(109,94,252,.25);
    transition:.25s ease;
}
.btn:hover{transform:translateY(-3px)}
.box{
    min-width:230px;
    min-height:110px;
    border-radius:20px;
    background:white;
    border:1px solid #e1e7ef;
    display:grid;
    place-items:center;
    font-size:22px;
    font-weight:800;
    padding:18px;
    transition:.3s ease;
}
.message{
    margin:22px auto 0;
    width:min(620px,100%);
    padding:14px 20px;
    min-height:50px;
    border-radius:16px;
    background:#eef8f1;
    color:#16834a;
    font-size:18px;
    font-weight:bold;
    text-align:center;
}
.input,.select{
    width:min(460px,90%);
    padding:14px 16px;
    font-size:18px;
    border-radius:14px;
    border:2px solid #dce3ec;
    outline:none;
    background:white;
}
.input:focus,.select:focus{border-color:#6d5efc;box-shadow:0 0 0 4px rgba(109,94,252,.10)}
.small{font-size:14px;color:#6b7686;margin-top:16px;text-align:center}
a.back{display:inline-block;margin-top:22px;color:#4258b5;text-decoration:none;font-weight:bold}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px}
.card{text-decoration:none;color:#162033;background:#fff;border:1px solid #e5eaf1;border-radius:18px;padding:18px;box-shadow:0 10px 24px rgba(24,39,75,.06);transition:.2s}
.card:hover{transform:translateY(-4px);box-shadow:0 16px 30px rgba(24,39,75,.10)}
.card strong{display:block;margin-bottom:8px}
.card span{font-size:14px;color:#5368c5}
</style>
</head>
<body>
<div class="app">
  <span class="badge">XAMPP Practice Pack</span>
  <h1>JavaScript Events — 28 Individual Examples</h1>
  <div class="desc">
    Every file is self-contained: HTML + CSS + JavaScript are inside the same <b>.php</b> file.
    Copy this folder to <b>C:/xampp/htdocs/</b>, start Apache, then open this index in localhost.
  </div>
  <div class="grid">
    <a class="card" href="event01_click.php"><strong>Click Event</strong><span>Open demo →</span></a><a class="card" href="event02_mouseover.php"><strong>Mouse Hover / Mouseover Event</strong><span>Open demo →</span></a><a class="card" href="event03_dblclick.php"><strong>Double Click Event</strong><span>Open demo →</span></a><a class="card" href="event04_keyboard.php"><strong>Keyboard Event</strong><span>Open demo →</span></a><a class="card" href="event05_input.php"><strong>Input Event</strong><span>Open demo →</span></a><a class="card" href="event06_submit.php"><strong>Submit Event</strong><span>Open demo →</span></a><a class="card" href="event07_change.php"><strong>Change Event</strong><span>Open demo →</span></a><a class="card" href="event08_focus.php"><strong>Focus Event</strong><span>Open demo →</span></a><a class="card" href="event09_blur.php"><strong>Blur Event</strong><span>Open demo →</span></a><a class="card" href="event10_scroll.php"><strong>Scroll Event</strong><span>Open demo →</span></a><a class="card" href="event11_mouseenter.php"><strong>Mouse Enter Event</strong><span>Open demo →</span></a><a class="card" href="event12_mouseleave.php"><strong>Mouse Leave Event</strong><span>Open demo →</span></a><a class="card" href="event13_mousemove.php"><strong>Mouse Move Event</strong><span>Open demo →</span></a><a class="card" href="event14_mouseout.php"><strong>Mouse Out Event</strong><span>Open demo →</span></a><a class="card" href="event15_keydown.php"><strong>Key Down Event</strong><span>Open demo →</span></a><a class="card" href="event16_keyup.php"><strong>Key Up Event</strong><span>Open demo →</span></a><a class="card" href="event17_load.php"><strong>Load Event</strong><span>Open demo →</span></a><a class="card" href="event18_domcontentloaded.php"><strong>DOMContentLoaded Event</strong><span>Open demo →</span></a><a class="card" href="event19_resize.php"><strong>Resize Event</strong><span>Open demo →</span></a><a class="card" href="event20_contextmenu.php"><strong>Context Menu Event</strong><span>Open demo →</span></a><a class="card" href="event21_copy.php"><strong>Copy Event</strong><span>Open demo →</span></a><a class="card" href="event22_paste.php"><strong>Paste Event</strong><span>Open demo →</span></a><a class="card" href="event23_dragstart.php"><strong>Drag Start Event</strong><span>Open demo →</span></a><a class="card" href="event24_drop.php"><strong>Drop Event</strong><span>Open demo →</span></a><a class="card" href="event25_touchstart.php"><strong>Touch Start Event</strong><span>Open demo →</span></a><a class="card" href="event26_wheel.php"><strong>Wheel Event</strong><span>Open demo →</span></a><a class="card" href="event27_reset.php"><strong>Reset Event</strong><span>Open demo →</span></a><a class="card" href="event28_select.php"><strong>Select Event</strong><span>Open demo →</span></a>
  </div>
</div>
</body>
</html>