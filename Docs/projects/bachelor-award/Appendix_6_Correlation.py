#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar 15 09:50:42 2022

@author: EmmaMoerk
"""

import pandas as pd
import numpy as np
from scipy import stats

df_r = pd.read_excel('Data_lab_Individual.xlsx','Reactors') # Import data
df_b  = pd.read_excel('Data_lab_Individual.xlsx','Boxes')


def reactorcorrelation(reactor, row1, row2): 
    ''' 
    Correlation for reaktorer 
    
   # Reactor is the reactor which we want to make correlations within
   # row1 is the first value we want to correlate
   # row2 is the second value we want to correlate
    '''
    x = df_r.loc[(df_r['Reactor'] == reactor)] 
    
    y = x[row1].dropna()
    
    z = x[row2].dropna()
        
    Corr = np.corrcoef(z,y)[0,1]
        
    
    return Corr


# Rank correlation for pH correlations
def rankcorr(reactor,pH,row2):
    ''' Rank correlation mellem pH og anden værdi for reaktorer'''

    x = df_r.loc[(df_r['Reactor'] == reactor)] 
    
    y = x[pH].dropna()
    
    z = x[row2].dropna()
    
    spearman = stats.spearmanr(y,z)
    
    return spearman
 
##############################################################################

# Correlation for boxes

def boxcorrelation(box, row1, row2): 
    '''Correlation mellem box X og to værdier
    Reactor is the reactor which we want to make correlations within
    row1 is the first value we want to correlate
    row2 is the second value we want to correlate '''

    x = df_b.loc[(df_b['Box'] == box)] 
    
    y = x[row1].dropna()
    
    z = x[row2].dropna()
        
    BCorr = np.corrcoef(z, y)[0, 1]
        
    
    return(BCorr)


# Rank correlation for pH correlations!
def rankcorr2(box,pH,row2):
    ''' Rank correlation mellem pH og anden værdi for box'''
    x = df_b.loc[(df_b['Box'] == box)] 
    
    y = x[pH].dropna()
    
    z = x[row2].dropna()
    
    spearman = stats.spearmanr(y,z)
    
    return spearman


##############################################################################
#For-loop som tager alle reaktorer med i tabellen.

names =['C1', 'C2', 'C3', 'CC1', 'CC2', 'CC3', 'S1', 'S2', 'S3', 'RC1', 'RC2',
        'RC3', 'SC1', 'SC2', 'SC3' ]

dopot = np.zeros(len(names))
ecpot = np.zeros(len(names))
phdo = np.zeros(len(names))
phph = np.zeros(len(names))
phcurrent = np.zeros(len(names))
tempcurrent = np.zeros(len(names))
ECcurrent = np.zeros(len(names))
DOcurrent = np.zeros(len(names))

for i in range(0,9): # Shall not make correlation between Pot. and anything for the controls.
    reactors = names
    dopot[i] = reactorcorrelation(names[i],'DOcathode', 'Pot.')
    ecpot[i] = reactorcorrelation(names[i], 'ECcathode', 'Pot.')
    phcurrent[i] = rankcorr(names[i],'pHanode','Strøm') [0]
    tempcurrent[i] = reactorcorrelation(names[i],'Temp.','Strøm')
    ECcurrent[i] = reactorcorrelation(names[i],'ECcathode','Strøm')
    DOcurrent[i] = reactorcorrelation(names[i],'DOcathode','Strøm')
for i in range(0,15): #Skal lave korrelation for alle reaktorer med pH
    phdo[i] = rankcorr(names[i], 'pHcathode', 'DOcathode')[0]
    phph[i] = rankcorr(names[i],'pHcathode', 'pHanode') [0]


# Make dataframe with info of reactors
names_table_reactor =['Coal 1', 'Coal 2', 'Coal 3', 'Coal Control 1',
        'Coal Control 2', 'Coal Control 3', 'Steel 1', 'Steel 2', 'Steel 3', 
        'Steel Control 1', 'Steel Control 2', 'Steel Control 3', 'Control 1',
        'Control 2', 'Control 3']

dict = {'Reactors': names_table_reactor, 'pH/DO':phdo, 
        'pH Anode/pH Cathode':phph, 'pH/Current':phcurrent,
        'Temperature/current': tempcurrent, 'EC/Current': ECcurrent, 
        'DO/Current': DOcurrent, 'DO/Pot':dopot, 'EC/Pot':ecpot}
table_reactor = pd.DataFrame(dict)
table_reactor.style

#print(table_reactor.to_latex()) #Activate to get a latex code

##############################################################################

#For-loop which takes all box values in table.

names2 =['LL1', 'LL2', 'LL3', 'SL1', 'SL2', 'SL3', 'C-SL1', 'C-SL2', 'C-SL3',
         'CB1', 'CB2','CB3']

dopot2 = np.zeros(len(names2))
ecpot2 = np.zeros(len(names2))
phdo2 = np.zeros(len(names2))
phph2 = np.zeros(len(names2))
phcurrent2 = np.zeros(len(names2))
tempcurrent2 = np.zeros(len(names2))
ECcurrent2 = np.zeros(len(names2))
DOcurrent2 = np.zeros(len(names2))



for i in range(0,9): # No Pot. in the controls

    box = names2
    dopot2[i] = boxcorrelation(names2[i],'DO', 'Pot.')
    ecpot2[i] = boxcorrelation(names2[i], 'EC', 'Pot.')
    phcurrent2[i] = rankcorr2(names2[i],'pH','Strøm') [0]
    tempcurrent2[i] = boxcorrelation(names2[i],'Temp.','Strøm')
    ECcurrent2[i] = boxcorrelation(names2[i],'EC','Strøm')
    DOcurrent2[i] = boxcorrelation(names2[i],'DO','Strøm')

for i in range(0,12): # pH in all
    phdo2[i] = rankcorr2(names2[i], 'pH', 'DO')[0]


names_table_box =['Large/Large 1','Large/Large 2','Large/Large 3', 
         'Large/Small 1','Large/Small 2','Large/Small 3',
         'Large/Small Control 1','Large/Small Control 2',
         'Large/Small Control  3','Control 1', 'Control  2','Control  3']

dict2 = {'Boxes': names_table_box, 'pH/DO':phdo2, 'pH/Current': phcurrent2,
         'Temperture/Current': tempcurrent2, 'EC/Current': ECcurrent2, 
         'DO/Current': DOcurrent2, 'DO/Pot':dopot2, 'EC/Pot': dopot2}

table_box = pd.DataFrame(dict2)
table_box.style

# print(table_box.to_latex()) #Activate to get a latex code

##############################################################################





