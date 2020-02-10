package com.example.area_android.ui.areas

import android.graphics.Color
import android.graphics.drawable.Drawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.isEmpty
import androidx.core.view.size
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProviders
import com.example.area_android.AreaApplication
import com.example.area_android.R
import com.github.kittinunf.fuel.Fuel
import com.github.kittinunf.fuel.json.responseJson
import com.github.kittinunf.result.Result
import com.google.android.material.button.MaterialButton
import kotlinx.android.synthetic.main.fragment_areas.*
import net.steamcrafted.materialiconlib.MaterialDrawableBuilder
import org.json.JSONArray
import org.json.JSONObject

class AreasFragment : Fragment() {

    private lateinit var areasViewModel: AreasViewModel

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        areasViewModel =
            ViewModelProviders.of(this).get(AreasViewModel::class.java)
        val root = inflater.inflate(R.layout.fragment_areas, container, false)

        val app = this.activity!!.application as AreaApplication

        root.findViewById<Button>(R.id.action_button).setOnClickListener {
            val url : String = app.serverUrl + "/actions"
            Fuel.get(url)
                .responseJson { request, response, result ->
                    when (result) {
                        is Result.Failure -> {
                            print("Failed to get actions fragment area print \n")
                        }
                        is Result.Success -> {
                            //Pas oublier de mettre tout ça dans une fun
                            val obj : JSONObject = result.get().obj()
                            val data : JSONObject = obj.getJSONObject("data")

                            actionButtonsLayout.removeViewsInLayout(0, actionButtonsLayout.size)
                            for (i : Int in 1 until (app.services?.size ?: 10)) {
                                val namz : String = app.services?.get(i) !!
                                val actionsArray : JSONArray = data.getJSONArray(namz)
                                for (j : Int in 0 until actionsArray.length()) {
                                    val actions : JSONObject = actionsArray.getJSONObject(j)

//                                    val d: Drawable =
//                                        MaterialDrawableBuilder.with(this.activity)
//                                            .setIcon(MaterialDrawableBuilder.IconValue.valueOf("list"))
//                                            .setColor(Color.WHITE)
//                                            .setToActionbarSize()
//                                            .build()

                                    val button = MaterialButton(this.activity!!)
                                    button.text = actions.getString("displayName")
//                                    button.icon = d
                                    button.setOnClickListener {
                                        Toast.makeText(context, actions.getString("description"), Toast.LENGTH_LONG).show()
                                    }
                                        actionButtonsLayout.addView(button)
                                    print("Voici les actions n° " + j + ": " + actions + "   mrc \n")
                                }
                            }

                        }
                    }
                }
        }
        //juste pour test à retirer
        root.findViewById<Button>(R.id.test_button_google).setOnClickListener {
            if (app.services?.contains("google")!!) {
            }
            else {
                app.services?.add("google")
            }
        }

        return root
    }


    fun getServices(service : String) {
        val app = this.activity!!.application as AreaApplication
        val url: String = app.serverUrl!! + "/services/" + service + "/actions"
        Fuel.get(url)
            .responseJson { request, response, result ->
                when (result) {
                    is Result.Failure -> {
                        print("RESULT PABON ICI LA : " + response.toString() +  "\n")
                        Toast.makeText(context, result.toString(), Toast.LENGTH_LONG).show()
                    }
                    is Result.Success -> {
                        print("RESULT BON ICI LA : " + response.toString() +  "\n")
                        Toast.makeText(context, result.toString(), Toast.LENGTH_LONG).show()
                    }
                }
            }
    }
}