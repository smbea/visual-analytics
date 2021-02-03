import numpy as np # linear algebra
import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)
import matplotlib as mpl
import matplotlib.pyplot as plt
import seaborn as sns
sns.set()
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
# matplotlib inline

def main():
    df = pd.read_csv('./dataset.csv')
    columns_names=df.columns.tolist()
    df_drop=df.drop(labels=
        ['company','country', 'director', 'genre', 'name', 'rating', 'star','released','writer', 'year']
    ,axis=1)

    X_std = StandardScaler().fit_transform(df_drop)
    mean_vec = np.mean(X_std, axis=0)
    cov_mat = (X_std - mean_vec).T.dot((X_std - mean_vec)) / (X_std.shape[0]-1)
    #print('Covariance matrix \n%s' %cov_mat)
    #print('NumPy covariance matrix: \n%s' %np.cov(X_std.T))

    eig_vals, eig_vecs = np.linalg.eig(cov_mat)

    #print('Eigenvectors \n%s' %eig_vecs)
    #print('\nEigenvalues \n%s' %eig_vals)

    eig_pairs = [(np.abs(eig_vals[i]), eig_vecs[:,i]) for i in range(len(eig_vals))]

    # Sort the (eigenvalue, eigenvector) tuples from high to low
    eig_pairs.sort(key=lambda x: x[0], reverse=True)

    # Visually confirm that the list is correctly sorted by decreasing eigenvalues
    #print('Eigenvalues in descending order:')
    

    tot = sum(eig_vals)
    var_exp = [(i / tot)*100 for i in sorted(eig_vals, reverse=True)]

    matrix_w = np.hstack((eig_pairs[0][1].reshape(5,1), 
                      eig_pairs[1][1].reshape(5,1)
                    ))

    Y = X_std.dot(matrix_w)
    sklearn_pca = PCA(n_components=5)
    Y_sklearn = sklearn_pca.fit_transform(X_std)

    pca = PCA(n_components=5).fit_transform(X_std)

    kmeans_pca = KMeans(3)
    kmeans_pca.fit(pca)
    df_kmeas = pd.concat([df,pd.DataFrame(pca)], axis=1)
    df_kmeas.columns.values[-5:] = ['Component1', 'Component2', 'Component3', 'Component4', 'Component5']
    df_kmeas['cluster'] = kmeans_pca.labels_
    print(df_kmeas)
    df_kmeas['Segment'] = df_kmeas['cluster'].map({
        0:"first",
        1:"second",
        2:"third",
        3:"fourth"
    })

    x_axis = df_kmeas['Component1']
    y_axis = df_kmeas['Component2']
    sns.scatterplot(x_axis, y_axis, hue= df_kmeas['Segment'], palette = ['g','r','c'])
    #plt.show()

    dat = pd.DataFrame(df_kmeas)
    dat.to_csv('pca.csv', index=False)

if __name__ == "__main__":
    main()