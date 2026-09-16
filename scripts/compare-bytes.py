#!/usr/bin/env python3
with open('routime/tools/theatre/index.html', 'rb') as f:
    good = f.read()
with open('routime/tools/fit/index.html', 'rb') as f:
    bad = f.read()
volver_good = good.find(b'Volver')
volver_bad = bad.find(b'Volver')
print('Good around Volver:', good[volver_good-15:volver_good+10].hex())
print('Bad  around Volver:', bad[volver_bad-15:volver_bad+10].hex())
print()
print('Good ← bytes:', good[volver_good-3:volver_good].hex())
print('Bad  ← bytes:', bad[volver_bad-3:volver_bad].hex())
