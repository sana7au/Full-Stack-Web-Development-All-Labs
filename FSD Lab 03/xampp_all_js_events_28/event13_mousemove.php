<?php /* Mouse Move Event — single-file XAMPP example. HTML + CSS + JavaScript are all inside this file. */ ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Mouse Move Event</title>
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


</style>
</head>
<body>
<div class="app">
  <span class="badge">JavaScript Event Example</span>
  <h1>Mouse Move Event</h1>
  <div class="desc">Runs continuously while the pointer moves over an element.</div>
  <div class="demo">
    
<div id="area" class="box" style="width:100%;height:220px">Move the mouse here</div>
<div id="message" class="message">X: 0 | Y: 0</div>

  </div>
  <a class="back" href="index.php">← Back to all events</a>
</div>
<script>

const area = document.getElementById("area");
const message = document.getElementById("message");

area.addEventListener("mousemove", function(event){
    const r = area.getBoundingClientRect();
    const x = Math.round(event.clientX - r.left);
    const y = Math.round(event.clientY - r.top);
    message.innerHTML = "X: " + x + " | Y: " + y;
    area.style.background =
      "radial-gradient(circle at " + x + "px " + y + "px,#dff9ff,#ffffff 35%)";
});

</script>
</body>
</html>