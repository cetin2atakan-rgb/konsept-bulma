"""Split 1 fps 6x5 frame sheets into shots and write labelled contact sheets.
    python tools/segment_sheets.py <sheet_dir> <PREFIX> <out_dir>
"""
import sys, glob, json, numpy as np
from PIL import Image, ImageDraw, ImageFont
src, prefix, out = sys.argv[1], sys.argv[2], sys.argv[3]
cells=[]
for f in sorted(glob.glob(f"{src}/{prefix}_*.jpg")):
    im=Image.open(f).convert('RGB')
    for r in range(5):
        for c in range(6):
            cells.append(im.crop((c*384, r*216, c*384+384, r*216+216)))
# drop trailing black padding cells (tile filler)
while cells and np.asarray(cells[-1]).mean() < 2: cells.pop()
feat=[]
for im in cells:
    a=np.asarray(im.resize((48,27)).convert('L'),dtype=np.float32)
    h=np.histogram(np.asarray(im.convert('HSV'))[...,0],bins=16,range=(0,255))[0]/ (384*216)
    feat.append((a,h))
d=[0.0]
for i in range(1,len(feat)):
    pix=np.abs(feat[i][0]-feat[i-1][0]).mean()/255
    hist=np.abs(feat[i][1]-feat[i-1][1]).sum()
    d.append(pix+hist*0.5)
d=np.array(d); thr=max(0.10, np.percentile(d,80))
bounds=[0]+[i for i in range(1,len(d)) if d[i]>thr]
segs=[]
for j,b in enumerate(bounds):
    e=bounds[j+1] if j+1<len(bounds) else len(cells)
    if segs and e-b<2: segs[-1][1]=e; continue
    segs.append([b,e])
# split long continuous shots into ~10 s chunks so each gets its own description
sp=[]
for s0,e0 in segs:
    n=max(1,round((e0-s0)/10))
    step=(e0-s0)/n
    for k in range(n): sp.append([int(s0+k*step), int(s0+(k+1)*step) if k<n-1 else e0])
segs=sp
print(len(cells),'sec', len(segs),'segments thr',round(thr,3))
json.dump([{"id":f"{prefix}_{k+1:03d}","start":s,"end":e} for k,(s,e) in enumerate(segs)],open(f"{out}/{prefix}_segs.json","w"),indent=0)
# labelled sheets: 4x4 per sheet, representative = middle cell
try: font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",22)
except: font=ImageFont.load_default()
per=20
for p in range(0,len(segs),per):
    sh=Image.new('RGB',(5*384,4*216))
    for k,(s,e) in enumerate(segs[p:p+per]):
        m=(s+e)//2; im=cells[m].copy(); dr=ImageDraw.Draw(im)
        lab=f"{prefix}_{p+k+1:03d} {s//60}:{s%60:02d}-{e//60}:{e%60:02d}"
        dr.rectangle((0,0,384,28),fill=(0,0,0)); dr.text((4,2),lab,fill=(255,255,0),font=font)
        sh.paste(im,((k%5)*384,(k//5)*216))
    sh.save(f"{out}/{prefix}_sheet_{p//per+1:02d}.jpg",quality=80)
