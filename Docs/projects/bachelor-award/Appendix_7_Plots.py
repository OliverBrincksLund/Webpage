# -*- coding: utf-8 -*-
"""
Created on Wed Mar 23 18:31:03 2022

@author: olive
"""

import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from scipy.ndimage.filters import gaussian_filter1d

#############################################################################
#--------------------------------LOAD DATA----------------------------------#
#############################################################################

df1 = pd.read_excel('Data_lab_Individual.xlsx', 'Reactors')
df2 = pd.read_excel('Data_lab_Individual.xlsx', 'Boxes')
df3 = pd.read_excel('Data_lab_Individual.xlsx', 'Area of electrodes')
#############################################################################
#--------------------------------SORT DATA----------------------------------#
#############################################################################
#Convert all electrical columns to positive#
df1['Strøm'] = abs(df1['Strøm'])
df1['Pot.'] = abs(df1['Pot.'])
df1['Current/volume'] = abs(df1['Current/volume'])
df2['Strøm'] = abs(df2['Strøm'])
df2['Pot.'] = abs(df2['Pot.'])
#Area of electrodes
Area_steel = df3['Unnamed: 7'][19]
Area_steel_coal = df3['Unnamed: 7'][20]
#All coal data (Reactor)
Coal_options = ['C1', 'C2', 'C3',
                'CC1', 'CC2','CC3',
                'RC1', 'RC2', 'RC3']
Coal = df1.loc[df1['Reactor'].isin(Coal_options)]
#All steel data (Reactor)
Steel_options = ['S1', 'S2', 'S3',
                'SC1', 'SC2','SC3',
                'RC1', 'RC2', 'RC3']
Steel = df1.loc[df1['Reactor'].isin(Steel_options)]
#Coal vs steel data (Reactor)
Options = ['C1', 'C2', 'C3','S1', 'S2', 'S3']
Comparison = df1.loc[df1['Reactor'].isin(Options)]
#SS vs SL (Box)
Size_options = ['LL1','LL2','LL3','SL1','SL2','SL3']
LLvsSL = df2.loc[df2['Box'].isin(Size_options)]
#SS vs SL + KSL (Box)
Size_options2 = ['LL1','LL2','LL3','SL1','SL2','SL3','C-SL1','C-SL2','C-SL3']
LLvsSLandCSL = df2.loc[df2['Box'].isin(Size_options2)]
#All (Box)
All = ['LL1','LL2','LL3','SL1','SL2','SL3','C-SL1','C-SL2','C-SL3','CB1','CB2','CB3']
All_boxes = df2.loc[df2['Box'].isin(All)]

#-------------------------CALCULATIONS BASED ON DATA------------------------#
#Power#
Power = df1['Pot.']*df1['Strøm']
df1["Power"] = Power

#Sort data after resistance change
#After
#df3 = df1[['Reactor','Day', 'Strøm','Pot.','Power']][225:]
#df4 = df2[['Box','Day', 'Strøm','Pot.','Power [muW]']][156:]

#Get only C1-3 and S1-3 and divide with areas
C = Comparison[(Comparison['Reactor'].isin(['C1', 'C2', 'C3']))]['Strøm'] / Area_steel_coal
S = Comparison[(Comparison['Reactor'].isin(['S1', 'S2', 'S3']))]['Strøm'] / Area_steel
#Recombine the two dataframes
Comparison_current = pd.concat([S,C])
Comparison['Strøm'] = Comparison_current

#############################################################################
#---------------------PLOT STYLES AND PALETTES (REACTORS)-------------------#
#############################################################################
#style palette
x_col = 'Day'
hue_col1 = "Reactor"
style_col1 = "Reactor"

#color palette
cmap = sns.color_palette("hls", 75)
palette = {key:value for key,value in zip(df1[hue_col1].unique(), cmap)}
palette['C1'] = 'lime'
palette['C2'] = 'lime'
palette['C3'] = 'lime'
palette['CC'] = 'darkblue'
palette['CC1'] = 'darkblue'
palette['CC2'] = 'darkblue'
palette['CC3'] = 'darkblue'
palette['RC1'] = 'black'
palette['RC2'] = 'black'
palette['RC3'] = 'black'
palette['S1'] = 'blue'
palette['S2'] = 'blue'
palette['S3'] = 'blue'
palette['SC'] = 'Green'
palette['SC1'] = 'Green'
palette['SC2'] = 'Green'
palette['SC3'] = 'Green'
 
#style palette
dash_list = sns._core.unique_dashes(df1[style_col1].unique().size-1)
style = {key:value for key,value in zip(Coal[style_col1].unique(), dash_list[1:])}
style['C1'] = ''
style['C2'] = ''
style['C3'] = ''
style['CC1'] = (1,0.6,0.2)
style['CC2'] = (1,0.6,0.2)
style['CC3'] = (1,0.6,0.2)
style['RC1'] = (1,0.2,0.7,0.7)
style['RC2'] = (1,0.2,0.7,0.7)
style['RC3'] = (1,0.2,0.7,0.7)
style['S1'] = ''
style['S2'] = ''
style['S3'] = ''
style['SC1'] = (1,0.2,0.7,0.7)
style['SC2'] = (1,0.2,0.7,0.7)
style['SC3'] = (1,0.2,0.7,0.7)

sns.set_theme('paper')
sns.set_style("ticks")
sns.set_context("paper")

#############################################################################
#-------------------------PLOTS (REACTORS)----------------------------------#
#############################################################################
#--------------------------ALL REACTORS-------------------------------------#
sns.lineplot(data=df1, x=x_col, y='pHcathode', 
             hue=hue_col1, palette=palette,
             style=style_col1, dashes=style,
             markers={'C1': 'X','C2': 'X','C3':'X',
                      'CC1': 's', 'CC2': 's','CC3':'s',
                      'RC1': 'o', 'RC2': 'o', 'RC3': 'o',
                      'S1': 'v', 'S2': 'v', 'S3': 'v',
                      'SC1': 'D', 'SC2': 'D', 'SC3': 'D'},
             markersize=8, linewidth=1.5,
             legend=True)
plt.xticks((np.arange(0, df1["Day"].iloc[-1]+2, 4)))
plt.xlabel('Day', fontsize=12);
plt.ylabel('pH - cathode', fontsize=12);
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02), markerscale=1.4)
plt.savefig('pH - Cathode',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

sns.lineplot(data=df1, x=x_col, y='pHanode', 
             hue=hue_col1, palette=palette,
             style=style_col1, dashes=style,
             markers={'C1': 'X','C2': 'X','C3':'X',
                      'CC1': 's', 'CC2': 's','CC3':'s',
                      'RC1': 'o', 'RC2': 'o', 'RC3': 'o',
                      'S1': 'v', 'S2': 'v', 'S3': 'v',
                      'SC1': 'D', 'SC2': 'D', 'SC3': 'D'},
             markersize=8, linewidth=1.5,
             legend=True)
plt.xticks((np.arange(0, df1["Day"].iloc[-1]+2, 4)))
plt.xlabel('Day', fontsize=12);
plt.ylabel('pH - anode', fontsize=12);
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02), markerscale=1.4)
plt.savefig('pH - anode',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

#############################################################################
#---------------------BAR PLOTS OF SULPHATE / SULPHIDE----------------------#
#############################################################################
#Sort out the rows without any sulphate/sulphide measurements
Coal1 = Coal[['Reactor','Day','SO4^2-anode','H2S']].dropna()
Comparison1 = Comparison[['Reactor','Day','SO4^2-anode','H2S']].dropna()
Steel1 = Steel[['Reactor','Day','SO4^2-anode','H2S']].dropna()
#-------------------------Coal vs controls----------------------------------#
#Sulphate barplot
sns.barplot(data=Coal1, x=x_col, y='SO4^2-anode', 
             hue=hue_col1, palette=palette)
plt.xlabel('Day', fontsize=12)
plt.ylim([0, 750])
plt.ylabel(r'$SO_{4}^{2-}$ [mg/L]',fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulphat_Coal',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()
#Sulphide barplot
sns.barplot(data=Coal1, x=x_col, y='H2S', 
             hue=hue_col1, palette=palette)
plt.xlabel('Day', fontsize=12)
plt.ylabel(r'$H_{2}S$ [mg/L]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulphide_Coal',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

#-------------------------Steel + Controls----------------------------------#
#Sulphate barplot
sns.barplot(data=Steel1, x=x_col, y='SO4^2-anode', 
             hue=hue_col1, palette=palette)
plt.xlabel('Day', fontsize=12);
#plt.ylim([0, 750])
plt.ylabel(r'$SO_{4}^{2-}$ [mg/L]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulphat_Steel',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()
#Sulphide barplot
sns.barplot(data=Steel1, x=x_col, y='H2S', 
             hue=hue_col1, palette=palette)
plt.xlabel('Day', fontsize=12);
plt.ylabel(r'$H_{2}S$ [mg/L]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulphide_Steel',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

#--------------------------Current lineplot------------------------------------#
Coal_current = Comparison.loc[Comparison['Reactor'].isin(['C1','C2','C3'])][['Reactor','Day','Strøm','Current/volume']]
Steel_current = Comparison.loc[Comparison['Reactor'].isin(['S1','S2','S3'])][['Reactor','Day','Strøm','Current/volume']]

sns.lineplot(data=Comparison, x=x_col, y='Current/volume'#[:225], 
             ,hue=hue_col1, palette=palette,
             style=style_col1, dashes=style, 
             markers={'C1': 'X','C2': 'v','C3':'o','S1': 'X','S2': 'v','S3':'o'}, markersize=10, linewidth=1.5,
             legend=True)
plt.axvline(x=35, color='black',linestyle='--', linewidth=1.5, label='New \u03A9')
plt.ylabel('Current density $[mA/L]$',fontsize=12)
plt.legend(markerscale=1.5)
plt.savefig('Current_CoalVSsteel_volume',bbox_inches='tight',pad_inches = 0.1,dpi=300)


fig, axes = plt.subplots(1, 2, figsize=(22, 12),sharex=True)
sns.lineplot(ax = axes[0], data=Coal_current, x=x_col, y='Strøm'#[:225], 
             ,hue=hue_col1, palette=palette, markersize=20,
             style=style_col1, dashes=style, linewidth = 1.5, 
             markers={'C1': 'X','C2': 'v','C3':'o'},
             legend=True)
axes[0].axvline(x=35, color='black',linestyle='--', linewidth=1.5, label='New \u03A9')
axes[0].set_xticks((np.arange(0, df1["Day"].iloc[-1]+2, 4)))
axes[0].set_xlabel('Day', fontsize=18);
axes[0].set_ylabel(r'Current density $[mA/m^{2}]$', fontsize=18);
axes[0].tick_params(axis='both', which='major', labelsize=18)
axes[0].legend(markerscale=3,prop={'size': 18})
plt.setp(axes[0].get_legend().get_texts(), fontsize=22) # for legend text
plt.setp(axes[0].get_legend().get_title(), fontsize=25) # for legend title

sns.lineplot(ax = axes[1], data=Steel_current, x=x_col, y='Strøm'#[:225], 
             ,hue=hue_col1, palette=palette, markersize=18,
             style=style_col1, dashes=style, linewidth = 2.5,
             markers={'S1': 'X','S2': 'v','S3':'o'},
             legend=True)
axes[1].axvline(x=35, color='black', linestyle='--', linewidth=1.5, label='New \u03A9')
axes[1].set_xticks((np.arange(0, df1["Day"].iloc[-1]+2, 4)))
axes[1].set_xlabel('Day', fontsize=18);
axes[1].set_ylabel(r'Current density $[mA/m^{2}]$', fontsize=18);
axes[1].tick_params(axis='both', which='major', labelsize=25)
axes[1].legend(markerscale=3,prop={'size': 18})
plt.setp(axes[1].get_legend().get_texts(), fontsize=22) # for legend text
plt.setp(axes[1].get_legend().get_title(), fontsize=18) # for legend title
plt.savefig('Current_CoalVSsteel',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

#-------------------POWER AND POLARIZATION CURVES---------------------------#
df4 = pd.read_excel('Data_lab_Individual.xlsx', 'Polarization curve')
#Divide dataframe into reactors and boxes
Reactors = df4[0:55]
Boxes = df4[56:105]
Reactors.rename(columns = {'Treatment':'Reactor'}, inplace = True)
#Change values to positive values to better visualize the data
Boxes['Pot [V]'] = abs(Boxes['Pot [V]'])
Boxes['Power/area [W/m2]'] = abs(Boxes['Power/area [W/m2]'])
Boxes['Current/area  [A/m2]'] = abs(Boxes['Current/area  [A/m2]'])

Reactors['Pot [V]'] = abs(Reactors['Pot [V]'])
Reactors['Power/area [W/m2]'] = abs(Reactors['Power/area [W/m2]'])
Reactors['Current/area  [A/m2]'] = abs(Reactors['Current/area  [A/m2]'])

#REACTORS#
#Coal curves
#First remove steel control:
Coal_curves = Reactors.drop(Reactors.index[[49,50,51,52,53,54]])
#Then remove all steel treatments:
Coal_curves = Coal_curves.drop(Coal_curves.index[range(21,42)])

sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]', palette=palette, markersize=10, linewidth=1.5,
             hue=hue_col1, style=style_col1, data=Coal_curves, markers=True)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Power density [W/m2]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(markerscale=1.5)
plt.savefig('PowerCurve_Reactors_coal',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', palette=palette, markersize=10, linewidth=1.5,
             hue=hue_col1, style=style_col1, data=Coal_curves, markers=True)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Pot [V]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(markerscale=1.5)
plt.savefig('Polarization_Reactors_coal',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

#Steel curves
#First remove coal control:
Steel_curves = Reactors.drop(Reactors.index[[42,43,44,45,46,47,48]])
#Then remove all coal treatments:
Steel_curves = Steel_curves.drop(Steel_curves.index[range(0,21)])
sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]', palette=palette, markersize=10, linewidth=1.5,
             hue=hue_col1, style=style_col1, data=Steel_curves, markers=True)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Power density [W/m2]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(markerscale=1.5)
plt.savefig('PowerCurve_Reactors_steel',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]', palette=palette, markersize=10, linewidth=1.5,
             hue=hue_col1, style=style_col1, data=Steel_curves, markers=True)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Pot [V]', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(markerscale=1.5)
plt.savefig('Polarization_Reactors_steel',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

#Dual y-axis plot to compare current with pot in C1-3 and S1-3
#g = sns.lineplot(data=Steel_curves, hue=hue_col1,x='Current/area  [A/m2]',y='Pot [V]',legend=True, palette=palette,linestyle='dash')
##sns.lineplot(data=Steel_curves, hue=hue_col1, y='Power/area [W/m2]', x='Current/area  [A/m2]', ax=g.axes.twinx(),legend=True,palette=palette)
#plt.show()
#############################################################################
#--------------------------PLOT STYLES AND PALETTES (BOXES)-----------------#
#############################################################################
#style palette
x_col = 'Day'
hue_col2 = "Box"
style_col2 = "Box"
#color palette
cmap = sns.color_palette("hls", 75)
palette = {key:value for key,value in zip(df2[hue_col2].unique(), cmap)}
palette['LL1'] = 'orange'
palette['LL2'] = 'orange'
palette['LL3'] = 'orange'
palette['SL1'] = 'red'
palette['SL2'] = 'red'
palette['SL3'] = 'red'
palette['C-SL'] = 'black'
palette['C-SL1'] = 'black'
palette['C-SL2'] = 'black'
palette['C-SL3'] = 'black'
palette['CB1'] = 'grey'
palette['CB2'] = 'grey'
palette['CB3'] = 'grey'

#style palette
dash_list = sns._core.unique_dashes(df2[style_col2].unique().size-1)
style = {key:value for key,value in zip(df2[style_col2].unique(), dash_list[1:])}
style['LL1'] = ''
style['LL2'] = ''
style['LL3'] = ''
style['SL1'] = ''
style['SL2'] = ''
style['SL3'] = ''
style['C-SL1'] = (1,0.2,0.7,0.7)
style['C-SL2'] = (1,0.2,0.7,0.7)
style['C-SL3'] = (1,0.2,0.7,0.7)
style['CB1'] = (1,0.6,0.2)
style['CB2'] = (1,0.6,0.2)
style['CB3'] = (1,0.6,0.2)

sns.set_theme('paper')
sns.set_style("ticks")
sns.set_context("paper")
#############################################################################
#-------------------------PLOTS (BOXES)-------------------------------------#
#############################################################################
#--------------------------SS VS SL-----------------------------------------#
#Remove rows with no sulphate measurements
Boxes_sulphate = df2[['Box','Day','SO4^2-','H2S']].dropna()

sns.lineplot(data=LLvsSL, x=x_col, y='Strøm', 
             hue=hue_col2, palette=palette,
             style=style_col2, dashes=style,
             markers=True,
             markersize= 10, legend=True)
plt.axvline(x=35, color='black',linestyle='--',label = 'New \u03A9')
plt.xlabel('Day', fontsize=12);
plt.ylabel(r'Current density $[mA/m^{2}]$', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.xticks((np.arange(0, df2["Day"].iloc[-1]+2, 4)))
plt.legend(bbox_to_anchor=(1, 1.02), fontsize=10, markerscale=1.5)
plt.savefig('Current_LLvsSL',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

sns.lineplot(data=df2, x=x_col, y='pH',     
             hue=hue_col2, palette=palette,
             style=style_col2, dashes=style, markersize=8,
             markers={'LL1': 'X','LL2': 'X','LL3':'X',
                      'SL1': 's', 'SL2': 's','SL3':'s',
                      'C-SL1': 'v','C-SL2': 'v','C-SL3': 'v',
                      'CB1':'o','CB2':'o','CB3':'o'},
             legend=True)
plt.xticks((np.arange(0, df2["Day"].iloc[-1]+2, 4)))
plt.xlabel('Day', fontsize=12);
plt.ylabel('pH', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1, 1.02), fontsize=10,markerscale=1.5)
plt.savefig('pH - All',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

sns.barplot(data=Boxes_sulphate, x=x_col, y='SO4^2-', 
             hue=hue_col2, palette=palette)
plt.ylabel(r'$SO_{4}^{2-}$ [mg/L]')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulfat_boxes',bbox_inches='tight',pad_inches = 0,dpi=300)
plt.show()

#Make sulphate plot with averages and CI
avg_sulphate = pd.read_excel('Average_sulphate_boxes.xlsx')
avg_sulphate = avg_sulphate[['Box','Day','SO4^2-']].dropna()

sns.barplot(data=avg_sulphate, x=x_col, y='SO4^2-', 
             hue='Box',palette=['orange','red','black','grey'])
plt.ylabel(r'$SO_{4}^{2-}$ [mg/L]')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.savefig('Sulfat_boxes',bbox_inches='tight',pad_inches = 0,dpi=300)
plt.show()

#############################################################################
#--------------------POWER- AND POLARIZATION CURVES-------------------------#
#############################################################################
#BOXES#
Boxes.rename(columns = {'Treatment':'Box'}, inplace = True)

sns.lineplot(y='Power/area [W/m2]', x='Current/area  [A/m2]', 
             palette=palette, hue=hue_col2, style=style_col2,
             data=Boxes, markers=True, linewidth = 1.5,
             markersize= 8)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Power density [W/m2]', fontsize=12);
plt.legend(bbox_to_anchor=(1, 1.02),markerscale=1.5)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Power_Box',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()

sns.lineplot(x='Current/area  [A/m2]', y='Pot [V]',
             palette=palette, hue=hue_col2, style=style_col2,
             data=Boxes, markers=True, linewidth = 1.5,
             markersize= 8)
plt.xlabel('Current density [A/m2]', fontsize=12);
plt.ylabel('Pot [V]', fontsize=12);
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1.2, 1.02),markerscale=1.5)
plt.savefig('Polarization_Box',bbox_inches='tight',pad_inches = 0.1, dpi=300)
plt.show()


df1 = pd.read_csv('EO_BSc.csv', sep=',',engine='python')
days = ((pd.to_timedelta(df1['Time']).dt.total_seconds()) * 1.15740741 * 10**-5)+7
#x = np.array(df1['Time'])
df1["Time"] = days
x = df1['Time']
y1 = abs(df1[' SL_1_B4 Ave. (V) '])
y2 = abs(df1[' SL_2_B5 Ave. (V) '])
y3 = abs(df1[' SL_3_B6 Ave. (V) '])
y4 = abs(df1[' Coal_1_R1 Ave. (V) '])
y5 = abs(df1[' Coal_2_R2 Ave. (V) '])
y6 = abs(df1[' Coal_3_R3 Ave. (V) '])
y7 = abs(df1[' Steel_1_R7 Ave. (V) '])
y8 = abs(df1[' Steel_2_R8 Ave. (V) '])
y9 = abs(df1[' Steel_3_R9 Ave. (V) '])
y10 = abs(df1[' SS_1_B1 Ave. (V) '])
y11 = abs(df1[' SS_2_B2 Ave. (V) '])
y12 = abs(df1[' SS_3_B3 Ave. (V) '])


# Apply gaussian filter to smoothen out the curves.

ysmoothed1 = gaussian_filter1d(y1, sigma=150)
ysmoothed2 = gaussian_filter1d(y2, sigma=150)
ysmoothed3 = gaussian_filter1d(y3, sigma=150)
ysmoothed4 = gaussian_filter1d(y4, sigma=150)
ysmoothed5 = gaussian_filter1d(y5, sigma=150)
ysmoothed6 = gaussian_filter1d(y6, sigma=150)
ysmoothed7 = gaussian_filter1d(y7, sigma=150)
ysmoothed8 = gaussian_filter1d(y8, sigma=150)
ysmoothed9 = gaussian_filter1d(y9, sigma=150)
ysmoothed10 = gaussian_filter1d(y10, sigma=150)
ysmoothed11 = gaussian_filter1d(y11, sigma=150)
ysmoothed12 = gaussian_filter1d(y12, sigma=150)

plt.plot(x, ysmoothed4,color='limegreen',label='C1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed5,color='limegreen',label='C2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed6,color='limegreen',label='C3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylabel('Potential (V)', fontsize=12)
plt.ylim([0, 0.6])
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.xlabel('Day', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Pot_coal',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

plt.plot(x, ysmoothed7,color='blue',label='S1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed8,color='blue',label='S2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed9,color='blue',label='S3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylim([0, 0.6])
plt.xlabel('Day', fontsize=12)
plt.ylabel('Potential (V)', fontsize=12);
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Pot_Steel',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

plt.plot(x, ysmoothed10,color='orange',label='LL1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed11,color='orange',label='LL2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed12,color='orange',label='LL3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylim([0, 0.6])
plt.xlabel('Day', fontsize=12)
plt.ylabel('Potential (V)', fontsize=12);
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Pot_LL',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

plt.plot(x, ysmoothed1,color='red',label='SL1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed2,color='red',label='SL2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed3,color='red',label='SL3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1, 1.02))
plt.ylim([0, 0.6])
plt.xticks(np.arange(7, 55, step=5))
plt.xlabel('Day', fontsize=12)
plt.ylabel('Potential (V)', fontsize=12);
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Pot_SL',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()
#Change to current per area/volume
#C1-3
ysmoothed4 = gaussian_filter1d(y4, sigma=150)
ysmoothed4 = np.append((ysmoothed4[0:35500]/1000) / 0.4,(ysmoothed4[35500:]/4700) / 0.4)
ysmoothed5 = gaussian_filter1d(y5, sigma=150)
ysmoothed5 = np.append((ysmoothed5[0:35500]/1000) / 0.4,(ysmoothed5[35500:]/4700) / 0.4)
ysmoothed6 = gaussian_filter1d(y6, sigma=150)
ysmoothed6 = np.append((ysmoothed6[0:35500]/1000) / 0.4,(ysmoothed6[35500:]/560) / 0.4)

#S1-3
ysmoothed7 = gaussian_filter1d(y7, sigma=150)
ysmoothed7 = np.append((ysmoothed7[0:35500]/1000) / 0.4,(ysmoothed7[35500:]/4700) / 0.4)
ysmoothed8 = gaussian_filter1d(y8, sigma=150)
ysmoothed8 = (ysmoothed8/1000) / 0.4
ysmoothed9 = gaussian_filter1d(y9, sigma=150)
ysmoothed9 = (ysmoothed9/1000) / 0.4

plt.plot(x, ysmoothed4,color='limegreen',label='C1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed5,color='limegreen',label='C2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed6,color='limegreen',label='C3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylabel('Current density (A/L)', fontsize=12)
plt.ylim([0, 0.0007])
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.xlabel('Day', fontsize=12)
plt.tick_params(axis='both', which='major', labelsize=12)
plt.legend(bbox_to_anchor=(1.2, 1.02))
plt.savefig('Current_density_coal',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

plt.plot(x, ysmoothed7,color='blue',label='S1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed8,color='blue',label='S2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed9,color='blue',label='S3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.xlabel('Day', fontsize=12)
plt.ylim([0, 0.0007])
plt.ylabel('Current density (A/L)', fontsize=12);
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1.2, 1.02))
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Current_density_Steel',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()
#LL1-3
ysmoothed10 = gaussian_filter1d(y10, sigma=150)
ysmoothed10 = np.append((ysmoothed10[0:35500]/1000) / 0.012718178,(ysmoothed10[35500:]/4700) / 0.012718178)
ysmoothed11 = gaussian_filter1d(y11, sigma=150)
ysmoothed11 = np.append((ysmoothed11[0:35500]/1000) / 0.012718178,(ysmoothed11[35500:]/1000) / 0.012718178)
ysmoothed12 = gaussian_filter1d(y12, sigma=150)
ysmoothed12 = np.append((ysmoothed12[0:35500]/1000) / 0.012718178,(ysmoothed12[35500:]/560) / 0.012718178)

#SL1-3
ysmoothed1 = gaussian_filter1d(y1, sigma=150)
ysmoothed1 = np.append((ysmoothed1[0:35500]/1000) / 0.012718178,(ysmoothed1[35500:]/1000) / 0.012718178)
ysmoothed2 = gaussian_filter1d(y2, sigma=150)
ysmoothed2 = np.append((ysmoothed2[0:35500]/1000) / 0.012718178,(ysmoothed2[35500:]/4700) / 0.012718178)
ysmoothed3 = gaussian_filter1d(y3, sigma=150)
ysmoothed3 = np.append((ysmoothed3[0:35500]/1000) / 0.012718178,(ysmoothed3[35500:]/6800) / 0.012718178)

plt.plot(x, ysmoothed10,color='orange',label='LL1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed11,color='orange',label='LL2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed12,color='orange',label='LL3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylim([0, 0.06])
plt.xlabel('Day', fontsize=12)
plt.ylabel(r'Current density ($A/m^2$)', fontsize=12);
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1.2, 1.02))
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Current_density_LL',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()

plt.plot(x, ysmoothed1,color='red',label='SL1', marker='v', linewidth = 2.5,markevery=2300,markerfacecolor='black', markersize=8)
plt.plot(x, ysmoothed2,color='red',label='SL2', marker='X', linewidth = 2.5,markevery=2300,markerfacecolor='lightgrey', markersize=8)
plt.plot(x, ysmoothed3,color='red',label='SL3', marker='o', linewidth = 2.5,markevery=2300,markerfacecolor='darkgrey', markersize=8)
plt.xticks(np.arange(7, 55, step=5))
plt.ylim([0, 0.06])
plt.xlabel('Day', fontsize=12)
plt.ylabel(r'Current density ($A/m^2$)', fontsize=12);
plt.axvline(x=32, color='black',linestyle='--', linewidth=2.0, label='New \u03A9')
plt.legend(bbox_to_anchor=(1.2, 1.02))
plt.tick_params(axis='both', which='major', labelsize=12)
plt.savefig('Current_density_SL',bbox_inches='tight',pad_inches = 0.1,dpi=300)
plt.show()