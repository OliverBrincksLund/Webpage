# -*- coding: utf-8 -*-
"""
Created on Mon Apr  4 13:50:24 2022

@author: OLIVER
"""

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#############################################################################
#--------------------------------LOAD DATA----------------------------------#
#############################################################################

df1 = pd.read_excel('Data_lab_Individual.xlsx', 'Polarization curve')
#-------------------------CALCULATIONS BASED ON DATA------------------------#
Reactors = df1[0:55]
Boxes = df1[56:105]
sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]', hue='Treatment',
             style='Treatment', data=Boxes, markers = True)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', hue='Treatment',
             style='Treatment', data=Boxes, markers=True)
plt.show()

sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]',
             hue='Treatment', style='Treatment', data=Reactors, markers=True)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', 
             hue='Treatment', style='Treatment', data=Reactors, markers=True)
plt.show()

# Change to absolute values
Boxes['Pot [V]'] = abs(Boxes['Pot [V]'])
Boxes['Power/area [W/m2]'] = abs(Boxes['Power/area [W/m2]'])
Boxes['Current/area  [A/m2]'] = abs(Boxes['Current/area  [A/m2]'])

Reactors['Pot [V]'] = abs(Reactors['Pot [V]'])
Reactors['Power/area [W/m2]'] = abs(Reactors['Power/area [W/m2]'])
Reactors['Current/area  [A/m2]'] = abs(Reactors['Current/area  [A/m2]'])

#-------------------------Power/Polarization curves-------------------------
## BOXES ##
sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]',
             hue='Treatment', style='Treatment', data=Boxes, markers=True)
plt.savefig('PowerCurve_Boxes', dpi=600)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', 
             hue='Treatment', style='Treatment', data=Boxes, markers=True)
plt.savefig('Polarization_Boxes', dpi=600)
plt.show()

## REACTORS ##
#Coal curves
#First remove steel control:
Coal_curves = Reactors.drop(Reactors.index[[49,50,51,52,53,54]])
#Then remove all steel treatments:
Coal_curves = Coal_curves.drop(Coal_curves.index[range(21,42)])
sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]',
             hue='Treatment', style='Treatment', data=Coal_curves, markers=True)
plt.savefig('PowerCurve_Reactors_coal', dpi=600)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', 
             hue='Treatment', style='Treatment', data=Coal_curves, markers=True)
plt.savefig('Polarization_Reactors_coal', dpi=600)
plt.show()

#Steel curves
#First remove coal control:
Steel_curves = Reactors.drop(Reactors.index[[42,43,44,45,46,47,48]])
#Then remove all coal treatments:
Steel_curves = Steel_curves.drop(Steel_curves.index[range(0,21)])

sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]',
             hue='Treatment', style='Treatment', data=Steel_curves, markers=True)
plt.savefig('PowerCurve_Reactors_steel', dpi=600)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', 
             hue='Treatment', style='Treatment', data=Steel_curves, markers=True)
plt.savefig('Polarization_Reactors_steel', dpi=600)
plt.show()

#Remove S3
Steel_curves = Steel_curves[Steel_curves["Treatment"].str.contains("S3") == False]

sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]',
             hue='Treatment', style='Treatment', data=Steel_curves, markers=True)
#plt.savefig('PowerCurve_Reactors_steel', dpi=600)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', 
             hue='Treatment', style='Treatment', data=Steel_curves, markers=True)
#plt.savefig('Polarization_Reactors_steel', dpi=600)
plt.show()