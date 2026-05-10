#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Sun May 15 19:28:18 2022

@author: EmmaMoerk
"""

import pandas as pd
import numpy as np

df1 = pd.read_excel ('Data_lab_Individual.xlsx','Reactors')
df2 = pd.read_excel ('Data_lab_Individual.xlsx','Boxes')

#df1 = df1[:225]
#df2 = df2[:156]

##############################################################################
# VALUES FOR REACTORS
##############################################################################


names1 =['C1', 'C2', 'C3', 'CC1', 'CC2', 'CC3', 'S1', 'S2', 'S3', 'RC1', 'RC2',
        'RC3', 'SC1', 'SC2', 'SC3' ]

##############################################################################
# Averages of OCP for coal

OCP_coal = np.zeros(len(df1.loc[(df1['Reactor'] == 'CC1')]['Pot.']))

for l in range(len(OCP_coal)):
    liste = list(df1.loc[(df1['Reactor'] == 
                         'CC1')]['Pot.'])[l], list(df1.loc[(df1['Reactor'] == 
                         'CC2')]['Pot.'])[l],list(df1.loc[(df1['Reactor'] == 
                         'CC3')]['Pot.'])[l]
    OCP_coal[l] = np.mean(liste) 
    # Calculates averages of coal control OCP for each measuring date

# Average of OCP for steel

OCP_steel = np.zeros(len(df1.loc[(df1['Reactor'] == 'SC1')]['Pot.']))

for l in range(len(OCP_steel)):
    liste2 = list(df1.loc[(df1['Reactor'] == 
                           'SC1')]['Pot.'])[l], list(df1.loc[(df1['Reactor'] == 
                           'SC2')]['Pot.'])[l],list(df1.loc[(df1['Reactor'] == 
                           'SC3')]['Pot.'])[l]
    
    OCP_steel[l] = np.mean(liste2) 


##############################################################################
# Internal resistance


# For coal

names_coal = ['C1', 'C2', 'C3']


RI_coal = np.empty((len(OCP_coal),0))

for i in range(len(names_coal)):
    I_coal = df1.loc[(df1['Reactor'] == names_coal[i])]['Strøm'].dropna()
    WP_coal = df1.loc[(df1['Reactor'] == names_coal[i])]['Pot.'].dropna()
    #WP_coal = WP_coal[:1]
    VI = OCP_coal - WP_coal
    RI = VI/I_coal
    RI = RI[:, np.newaxis]
    RI_coal = np.append(RI_coal, RI, 1)
    

# For steel

names_steel = ['S1', 'S2', 'S3']

RI_steel = np.empty((len(OCP_steel),0))
# Calculate internal resistance
for i in range(len(names_steel)):
    I_steel = df1.loc[(df1['Reactor'] == names_steel[i])]['Strøm'].dropna()
    WP_steel = df1.loc[(df1['Reactor'] == names_steel[i])]['Pot.'].dropna()
    #WP_coal = WP_coal[:1]
    VI = OCP_steel - WP_steel
    RI = VI/I_steel
    RI = RI[:, np.newaxis]
    RI_steel = np.append(RI_steel, RI, 1)
    

##############################################################################
# VALUES FOR BOXES
##############################################################################


# Code to calculate the average of control boxes for each measuring.

OCP = np.zeros(len(df2.loc[(df2['Box'] == 'C-SL1')]['Pot.']))


for l in range(len(OCP)):    
    liste = list(df2.loc[(df2['Box'] == 
                         'C-SL1')]['Pot.'])[l], list(df2.loc[(df2['Box'] == 
                         'C-SL2')]['Pot.'])[l], list(df2.loc[(df2['Box'] == 
                         'C-SL3')]['Pot.'])[l]    
    OCP[l] = np.mean(liste) # udregner gennemsnit af kul kontrol OCP

##############################################################################

# Internal resistance


names_box= ['SL1', 'SL2', 'SL3', 'LL1', 'LL2', 'LL3'] 

RI_box = np.empty((len(OCP),0))

for i in range(len(names_box)):
    I_box = df2.loc[(df2['Box'] == names_box[i])]['Strøm'].dropna()
    WP_box = df2.loc[(df2['Box'] == names_box[i])]['Pot.'].dropna()
    #WP_coal = WP_coal[:1]
    VI = OCP - WP_box
    RI = VI/I_box
    RI = RI[:, np.newaxis]
    RI_box = np.append(RI_box, RI, 1)
 
